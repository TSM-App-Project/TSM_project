import React, { useState, useEffect, useMemo } from "react";
import MainLayout from "../layouts/MainLayout";
import { api } from "../services/apiClient";
import { formatDate, formatId, toLocalDateTime } from "../services/idMapper";
import { getUserRole } from "../utils/auth";

export default function Services() {
  const currentUserRole = getUserRole();

  const [servicesList, setServicesList] = useState([]);
  const [ticketsList, setTicketsList] = useState([]);
  const [ticketDetails, setTicketDetails] = useState([]);
  const [customersList, setCustomersList] = useState([]);
  const [activeTab, setActiveTab] = useState("tickets");
  const [searchQuery, setSearchQuery] = useState("");
  const [pageError, setPageError] = useState("");

  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
  const [typeModalMode, setTypeModalMode] = useState("add");
  const [typeFormData, setTypeFormData] = useState({
    service_id: "",
    service_name: "",
    base_price: "",
    status: "ACTIVE",
  });
  const [deleteConfirmType, setDeleteConfirmType] = useState(null);
  const [deleteConfirmTicket, setDeleteConfirmTicket] = useState(null);
  const [ticketModalMode, setTicketModalMode] = useState("add");

  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const [newTicket, setNewTicket] = useState({
    customer_id: "",
    created_at: new Date().toISOString().split("T")[0],
    details: [],
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsTypeModalOpen(false);
        setIsTicketModalOpen(false);
        setIsDetailModalOpen(false);
        setDeleteConfirmType(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const mapServiceFromApi = (service) => ({
    service_id: service.serviceId,
    service_name: service.serviceName || "",
    base_price: Number(service.basePrice || 0),
    status: service.status || "ACTIVE",
  });

  const mapCustomerFromApi = (customer) => ({
    customer_id: customer.customerId,
    customer_name: customer.fullName || "",
  });

  const mapDetailFromApi = (detail) => ({
    detail_id: detail.detailId,
    ticket_id: detail.serviceTicket?.ticketId,
    service_id: detail.service?.serviceId,
    service_name: detail.service?.serviceName || "",
    service_price: Number(detail.servicePrice || 0),
    extra_cost: Number(detail.extraCost || 0),
    quantity: detail.quantity || 0,
    calculated_price: Number(detail.calculatedPrice || 0),
    subtotal: Number(detail.subtotal || 0),
    prepaid_amount: Number(detail.prepaidAmount || 0),
    remaining_amount: Number(detail.remainingAmount || 0),
    delivery_date: formatDate(detail.deliveryDate),
    status: detail.status || "CHƯA GIAO",
  });

  const buildTicketStatus = (ticketId, details) => {
    const rows = details.filter((d) => d.ticket_id === ticketId);
    if (rows.length === 0) return "CHƯA GIAO";
    const hasPending = rows.some((d) => d.status !== "ĐÃ GIAO");
    return hasPending ? "CHƯA GIAO" : "ĐÃ GIAO";
  };

  const mapTicketFromApi = (ticket, details) => ({
    ticket_id: ticket.ticketId,
    customer_id: ticket.customer?.customerId,
    customer_name: ticket.customer?.fullName || "N/A",
    user_id: ticket.user?.userId,
    created_at: formatDate(ticket.createdAt),
    grand_total: Number(ticket.grandTotal || 0),
    status: buildTicketStatus(ticket.ticketId, details),
  });

  const loadData = async () => {
    try {
      setPageError("");
      const [services, tickets, details, customers] = await Promise.all([
        api.get("/api/services"),
        api.get("/api/service-tickets"),
        api.get("/api/service-tickets/details"),
        api.get("/api/customers"),
      ]);

      const mappedDetails = (details || []).map(mapDetailFromApi);
      setServicesList((services || []).map(mapServiceFromApi));
      setTicketDetails(mappedDetails);
      setTicketsList(
        (tickets || []).map((ticket) =>
          mapTicketFromApi(ticket, mappedDetails),
        ),
      );
      setCustomersList((customers || []).map(mapCustomerFromApi));
    } catch (error) {
      setPageError(error.message || "Lỗi khi tải dữ liệu dịch vụ");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const stats = useMemo(() => {
    const totalTypes = servicesList.length;
    const totalRevenue = ticketsList.reduce((sum, t) => sum + t.grand_total, 0);

    const serviceCounts = {};
    ticketDetails.forEach((d) => {
      serviceCounts[d.service_name] =
        (serviceCounts[d.service_name] || 0) + d.quantity;
    });
    const mostUsed =
      Object.keys(serviceCounts).length > 0
        ? Object.keys(serviceCounts).reduce((a, b) =>
            serviceCounts[a] > serviceCounts[b] ? a : b,
          )
        : "N/A";

    return { totalTypes, totalRevenue, mostUsed };
  }, [servicesList, ticketsList]);

  const handleOpenAddType = () => {
    const nextId =
      servicesList.length > 0
        ? Math.max(...servicesList.map((s) => s.service_id)) + 1
        : 1;
    setTypeFormData({
      service_id: nextId,
      service_name: "",
      base_price: "",
      status: "ACTIVE",
    });
    setTypeModalMode("add");
    setIsTypeModalOpen(true);
  };

  const handleOpenEditType = (svc) => {
    setTypeFormData(svc);
    setTypeModalMode("edit");
    setIsTypeModalOpen(true);
  };

  const handleSaveType = async (e) => {
    e.preventDefault();
    const payload = {
      serviceName: typeFormData.service_name,
      basePrice: Number(typeFormData.base_price) || 0,
      status: typeFormData.status || "ACTIVE",
    };

    try {
      if (typeModalMode === "add") {
        await api.post("/api/services", payload);
      } else {
        await api.put(`/api/services/${typeFormData.service_id}`, payload);
      }
      await loadData();
      setIsTypeModalOpen(false);
    } catch (error) {
      setPageError(error.message || "Lỗi khi lưu dịch vụ");
    }
  };

  const confirmDeleteType = async () => {
    if (!deleteConfirmType) return;

    try {
      await api.del(`/api/services/${deleteConfirmType.service_id}`);
      await loadData();
      setDeleteConfirmType(null);
    } catch (error) {
      setPageError(error.message || "Lỗi khi xóa dịch vụ");
    }
  };


  const confirmDeleteTicket = async () => {
    if (!deleteConfirmTicket) return;
    try {
      await api.del(`/api/service-tickets/${deleteConfirmTicket.ticket_id}`);
      await loadData();
      setDeleteConfirmTicket(null);
    } catch (error) {
      setPageError(error.message || "Lỗi khi xóa phiếu dịch vụ");
    }
  };

  const handleEditTicket = (e, ticket) => {
    e.stopPropagation();
    const details = ticketDetails.filter(d => d.ticket_id === ticket.ticket_id);
    setNewTicket({
      ticket_id: ticket.ticket_id,
      customer_id: ticket.customer_id || "",
      created_at: ticket.created_at.split("-").reverse().join("-"),
      details: details.map(d => ({
        id: Date.now() + Math.random(),
        service_id: d.service_id,
        service_price: d.service_price,
        extra_cost: d.extra_cost,
        quantity: d.quantity,
        prepaid_amount: d.prepaid_amount,
        delivery_date: d.delivery_date ? d.delivery_date.split("-").reverse().join("-") : "",
        status: d.status
      }))
    });
    setTicketModalMode("edit");
    setIsTicketModalOpen(true);
  };

  const addDetailRow = () => {
    const newRow = {
      id: Date.now(),
      service_id: "",
      service_price: 0,
      extra_cost: 0,
      quantity: 1,
      prepaid_amount: 0,
      delivery_date: "",
      status: "CHƯA GIAO",
    };
    setNewTicket({ ...newTicket, details: [...newTicket.details, newRow] });
  };

  const removeDetailRow = (id) => {
    setNewTicket({
      ...newTicket,
      details: newTicket.details.filter((d) => d.id !== id),
    });
  };

  const updateDetailRow = (id, field, value) => {
    const updatedDetails = newTicket.details.map((d) => {
      if (d.id === id) {
        const updated = { ...d, [field]: value };
        if (field === "service_id") {
          const serviceId = parseInt(value, 10);
          const svc = servicesList.find((s) => s.service_id === serviceId);
          updated.service_price = svc ? svc.base_price : 0;
        }
        return updated;
      }
      return d;
    });
    setNewTicket({ ...newTicket, details: updatedDetails });
  };

  const calculateRowInfo = (row) => {
    const subtotal = row.service_price * row.quantity;
    const minPrepaid = subtotal * 0.5;
    const remaining = subtotal - (parseFloat(row.prepaid_amount) || 0);
    return { subtotal, minPrepaid, remaining };
  };

  const newTicketTotals = useMemo(() => {
    return newTicket.details.reduce(
      (acc, row) => {
        const { subtotal, remaining } = calculateRowInfo(row);
        acc.subtotal += subtotal;
        acc.prepaid += parseFloat(row.prepaid_amount) || 0;
        acc.remaining += remaining > 0 ? remaining : 0;
        return acc;
      },
      { subtotal: 0, prepaid: 0, remaining: 0 },
    );
  }, [newTicket.details]);

  const handleCreateTicket = async () => {
    try {
      if (!newTicket.customer_id) {
        setPageError("Vui lòng chọn khách hàng.");
        return;
      }
      if (newTicket.details.length === 0) {
        setPageError("Vui lòng thêm ít nhất một dịch vụ.");
        return;
      }

      const payload = {
        customerId: Number(newTicket.customer_id),
        userId: 1,
        createdAt: toLocalDateTime(newTicket.created_at),
        details: newTicket.details.map((row) => ({
          serviceId: Number(row.service_id),
          servicePrice: Number(row.service_price) || 0,
          extraCost: Number(row.extra_cost) || 0,
          quantity: Number(row.quantity) || 0,
          prepaidAmount: Number(row.prepaid_amount) || 0,
          deliveryDate: row.delivery_date,
          status: row.status,
        })),
      };


      if (ticketModalMode === "edit") {
        await api.put(`/api/service-tickets/${newTicket.ticket_id}`, payload);
      } else {
        await api.post("/api/service-tickets", payload);
      }
      await loadData();
      setIsTicketModalOpen(false);

    } catch (error) {
      setPageError(error.message || "Lỗi khi tạo phiếu dịch vụ");
    }
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  const formatNumberInput = (amount) =>
    amount ? Number(amount).toLocaleString("en-US") : "";

  // ================= LOGIC TÌM KIẾM =================
  const filteredTickets = ticketsList.filter((t) => {
    const query = searchQuery.toLowerCase();
    const ticketIdStr = formatId("SRV", t.ticket_id, 4).toLowerCase();
    return (
      (t.customer_name || "").toLowerCase().includes(query) ||
      ticketIdStr.includes(query) ||
      (t.status || "").toLowerCase().includes(query)
    );
  });

  const filteredServices = servicesList.filter((s) => {
    const query = searchQuery.toLowerCase();
    const serviceIdStr = `type-${s.service_id}`.toLowerCase();
    return (
      (s.service_name || "").toLowerCase().includes(query) ||
      serviceIdStr.includes(query) ||
      (s.status || "").toLowerCase().includes(query)
    );
  });

  return (
    <MainLayout
      title="Quản Lý Dịch Vụ"
      subtitle="Quản lý phiếu dịch vụ và danh mục dịch vụ"
    >
      {pageError && (
        <div className="mb-4 rounded-lg border border-error/30 bg-error-container/30 px-4 py-3 text-sm text-error">
          {pageError}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-card-padding shadow-sm flex items-center justify-between">
          <div>
            <span className="text-sm text-on-surface-variant block mb-1">
              Tổng Loại Dịch Vụ
            </span>
            <span className="font-headline-md text-headline-md font-bold text-on-surface">
              {stats.totalTypes}
            </span>
          </div>
          <div className="w-12 h-12 bg-primary-container/30 text-primary rounded-xl flex items-center justify-center">
            <span className="material-symbols-outlined">category</span>
          </div>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-card-padding shadow-sm flex items-center justify-between">
          <div>
            <span className="text-sm text-on-surface-variant block mb-1">
              Dịch Vụ Dùng Nhiều Nhất
            </span>
            <span className="font-title-lg text-title-lg font-bold text-on-surface">
              {stats.mostUsed}
            </span>
          </div>
          <div className="w-12 h-12 bg-secondary-container/30 text-secondary rounded-xl flex items-center justify-center">
            <span className="material-symbols-outlined">star</span>
          </div>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-card-padding shadow-sm flex items-center justify-between">
          <div>
            <span className="text-sm text-on-surface-variant block mb-1">
              Tổng Doanh Thu
            </span>
            <span className="font-headline-md text-headline-md font-bold text-on-surface">
              {formatCurrency(stats.totalRevenue)}
            </span>
          </div>
          <div className="w-12 h-12 bg-tertiary-container/30 text-tertiary rounded-xl flex items-center justify-center">
            <span className="material-symbols-outlined">payments</span>
          </div>
        </div>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-card-padding shadow-sm flex flex-col">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex p-1 bg-surface-container-low rounded-lg inline-flex">
            <button
              onClick={() => setActiveTab("tickets")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === "tickets" ? "bg-surface-bright text-on-surface shadow-sm" : "text-on-surface-variant hover:text-on-surface"}`}
            >
              Danh Sách Phiếu Dịch Vụ
            </button>
            {currentUserRole === "QUAN_LY" && (
              <button
                onClick={() => setActiveTab("types")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === "types" ? "bg-surface-bright text-on-surface shadow-sm" : "text-on-surface-variant hover:text-on-surface"}`}
              >
                Quản Lý Loại Dịch Vụ
              </button>
            )}
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                search
              </span>
              <input
                type="text"
                placeholder={
                  activeTab === "tickets"
                    ? "Tìm kiếm theo ID, tên, trạng thái..."
                    : "Tìm kiếm theo ID, tên, trạng thái..."
                }
                className="w-full pl-10 pr-4 py-2 bg-surface-bright border border-outline-variant/30 rounded-lg outline-none focus:border-primary text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {activeTab === "tickets" ? (
              <button
                onClick={() => {
                  setTicketModalMode("add");
                  setNewTicket({
                    customer_id: "",
                    created_at: new Date().toISOString().split("T")[0],
                    details: [],
                  });
                  setIsTicketModalOpen(true);
                }}
                className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-fixed-dim transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">
                  add
                </span>{" "}
                Tạo Phiếu Dịch Vụ
              </button>
            ) : (
              <button
                onClick={handleOpenAddType}
                className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-fixed-dim transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">
                  add
                </span>{" "}
                Thêm Loại Dịch Vụ
              </button>
            )}
          </div>
        </div>

        <div className="w-full max-h-[480px] overflow-y-auto custom-scrollbar border border-outline-variant/10 rounded-lg">
          {activeTab === "tickets" ? (
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead className="sticky top-0 bg-surface-container-lowest z-10 shadow-sm font-bold uppercase text-xs text-on-surface-variant">
                <tr>
                  <th className="p-4 bg-surface-container-lowest">ID Phiếu</th>
                  <th className="p-4 bg-surface-container-lowest">Khách Hàng</th>
                  <th className="p-4 text-center bg-surface-container-lowest">
                    Ngày Lập
                  </th>
                  <th className="p-4 bg-surface-container-lowest">
                    Tổng Tiền
                  </th>
                  <th className="p-4 text-center bg-surface-container-lowest">
                    Trạng Thái
                  </th>
                  <th className="p-4 text-right bg-surface-container-lowest">
                    Thao Tác
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredTickets.length > 0 ? (
                  filteredTickets.map((t) => (
                    <tr
                      key={t.ticket_id}
                      onDoubleClick={() => {
                        setSelectedTicket(t);
                        setIsDetailModalOpen(true);
                      }}
                      className="border-b border-outline-variant/10 hover:bg-surface-bright transition-colors cursor-pointer"
                      title="Nhấp đúp để xem chi tiết"
                    >
                      <td className="p-4 font-bold text-primary">
                        {formatId("SRV", t.ticket_id, 4)}
                      </td>
                      <td className="p-4">{t.customer_name}</td>
                      <td className="p-4 text-center">{t.created_at}</td>
                      <td className="p-4 font-medium">
                        {formatCurrency(t.grand_total)}
                      </td>
                      
                      <td className="p-4 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${t.status === "ĐÃ GIAO" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                        >
                          {t.status}
                        </span>
                      </td>
                      <td className="p-4 flex justify-end gap-2">
                        <button
                          onClick={(e) => handleEditTicket(e, t)}
                          className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-primary-container/30 rounded-lg transition-colors"
                          title="Sửa Phiếu"
                        >
                          <span className="material-symbols-outlined text-[20px]">edit</span>
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); setDeleteConfirmTicket(t); }}
                          className="p-1.5 text-on-surface-variant hover:text-error hover:bg-error-container/30 rounded-lg transition-colors"
                          title="Xóa Phiếu"
                        >
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="p-8 text-center text-on-surface-variant"
                    >
                      Không tìm thấy phiếu dịch vụ nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead className="sticky top-0 bg-surface-container-lowest z-10 shadow-sm font-bold uppercase text-xs text-on-surface-variant">
                <tr>
                  <th className="p-4 bg-surface-container-lowest">
                    ID Dịch Vụ
                  </th>
                  <th className="p-4 bg-surface-container-lowest">
                    Tên Dịch Vụ
                  </th>
                  <th className="p-4 bg-surface-container-lowest">
                    Đơn Giá
                  </th>
                  <th className="p-4 text-center bg-surface-container-lowest">
                    Trạng Thái
                  </th>
                  <th className="p-4 text-right bg-surface-container-lowest">
                    Thao Tác
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredServices.length > 0 ? (
                  filteredServices.map((s) => (
                    <tr
                      key={s.service_id}
                      className="border-b border-outline-variant/10 hover:bg-surface-bright transition-colors"
                    >
                      <td className="p-4 font-medium text-on-surface">
                        TYPE-{s.service_id}
                      </td>
                      <td className="p-4">{s.service_name}</td>
                      <td className="p-4">{formatCurrency(s.base_price)}</td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${s.status.toUpperCase() === "ACTIVE" ? "bg-primary" : "bg-error"}`}
                          ></div>
                          <span className="text-on-surface-variant">
                            {s.status.toUpperCase()}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleOpenEditType(s)}
                          className="p-1.5 hover:bg-primary-container/20 text-on-surface-variant hover:text-primary rounded mr-2"
                          title="Sửa"
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            edit_square
                          </span>
                        </button>
                        
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="p-8 text-center text-on-surface-variant"
                    >
                      Không tìm thấy loại dịch vụ nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* MODAL: THÊM/SỬA LOẠI DỊCH VỤ */}
      {isTypeModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-xl shadow-lg w-full max-w-sm animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b flex justify-between items-center">
              <h3 className="font-bold">
                {typeModalMode === "add" ? "Thêm Dịch Vụ" : "Sửa Dịch Vụ"}
              </h3>
              <button
                onClick={() => setIsTypeModalOpen(false)}
                className="text-on-surface-variant hover:text-error"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form className="p-5 flex flex-col gap-4" onSubmit={handleSaveType}>
              <div>
                <label className="text-sm font-medium block mb-1">
                  Mã Dịch Vụ
                </label>
                <input
                  type="text"
                  disabled
                  className="w-full p-2.5 bg-surface-variant/30 rounded border border-outline-variant/30 text-on-surface-variant"
                  value={`TYPE-${typeFormData.service_id}`}
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Trạng Thái</label>
                <select
                  className="w-full p-2.5 bg-surface-bright rounded border border-outline-variant/50 focus:border-primary outline-none"
                  value={typeFormData.status}
                  onChange={(e) =>
                    setTypeFormData({ ...typeFormData, status: e.target.value })
                  }
                >
                  <option value="ACTIVE">Hoạt động (ACTIVE)</option>
                  <option value="INACTIVE">Ngừng hoạt động (INACTIVE)</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">
                  Tên Dịch Vụ <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  className="w-full p-2.5 bg-surface-bright rounded border border-outline-variant/50 focus:border-primary outline-none"
                  value={typeFormData.service_name}
                  onChange={(e) =>
                    setTypeFormData({
                      ...typeFormData,
                      service_name: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">
                  Giá Cơ Bản (VND) <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  required
                  className="w-full p-2.5 bg-surface-bright rounded border border-outline-variant/50 focus:border-primary outline-none"
                  value={formatNumberInput(typeFormData.base_price)}
                  onChange={(e) => {
                    const rawValue = e.target.value.replace(/\D/g, "");
                    setTypeFormData({ ...typeFormData, base_price: rawValue });
                  }}
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant/20 mt-2">
                <button
                  type="button"
                  onClick={() => setIsTypeModalOpen(false)}
                  className="px-4 py-2 text-sm bg-surface-container-low rounded-lg hover:bg-surface-container-high transition-colors text-on-surface-variant"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-primary text-on-primary rounded-lg hover:bg-primary-fixed-dim transition-colors"
                >
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: XÁC NHẬN XÓA LOẠI DỊCH VỤ */}
      {deleteConfirmType && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-xl shadow-lg w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-error-container/30 text-error rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-3xl">
                  warning
                </span>
              </div>
              <h3 className="text-title-lg font-bold text-on-surface mb-2">
                Xóa Dịch Vụ?
              </h3>
              <p className="text-on-surface-variant text-sm mb-6">
                Bạn có chắc chắn muốn xóa dịch vụ{" "}
                <span className="font-bold text-on-surface">
                  {deleteConfirmType.service_name}
                </span>
                ? Hành động này không thể hoàn tác.
              </p>
              <div className="flex justify-center gap-3">
                
                <button
                  onClick={confirmDeleteType}
                  className="px-5 py-2.5 text-sm font-medium bg-error text-white hover:bg-[#b91c1c] rounded-lg transition-colors shadow-sm"
                >
                  Đồng Ý Xóa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: TẠO PHIẾU DỊCH VỤ MỚI */}
      {isTicketModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-xl shadow-xl w-full max-w-6xl animate-in zoom-in-95 flex flex-col max-h-[95vh]">
            <div className="p-5 border-b flex justify-between items-center bg-primary/5">
              <h3 className="font-bold text-primary flex items-center gap-2">
                <span className="material-symbols-outlined">add_task</span> {ticketModalMode === "add" ? "TẠO PHIẾU DỊCH VỤ MỚI" : "SỬA PHIẾU DỊCH VỤ"}
              </h3>
              <button
                onClick={() => setIsTicketModalOpen(false)}
                className="material-symbols-outlined hover:text-error"
              >
                close
              </button>
            </div>
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
              <div className="grid grid-cols-3 gap-6 mb-6 bg-surface-bright p-4 rounded-lg border border-outline-variant/30">
                <div>
                  <label className="text-xs font-bold uppercase text-on-surface-variant block mb-1">
                    Số phiếu
                  </label>
                  <input
                    type="text"
                    disabled
                    value={`SRV-${(ticketsList.length + 1).toString().padStart(4, "0")}`}
                    className="w-full p-2 bg-surface-variant/30 border rounded text-primary font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-on-surface-variant block mb-1">
                    Khách hàng <span className="text-error">*</span>
                  </label>
                  <select
                    className="w-full p-2 bg-surface-bright border rounded focus:border-primary outline-none"
                    value={newTicket.customer_id}
                    onChange={(e) =>
                      setNewTicket({
                        ...newTicket,
                        customer_id: e.target.value,
                      })
                    }
                  >
                    <option value="">-- Chọn khách hàng --</option>
                    {customersList.map((customer) => (
                      <option
                        key={customer.customer_id}
                        value={customer.customer_id}
                      >
                        {customer.customer_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-on-surface-variant block mb-1">
                    Ngày lập
                  </label>
                  <input
                    type="date"
                    value={newTicket.created_at}
                    onChange={(e) =>
                      setNewTicket({ ...newTicket, created_at: e.target.value })
                    }
                    className="w-full p-2 bg-surface-bright border rounded"
                  />
                </div>
              </div>

              <div className="mb-4 flex justify-between items-center">
                <h4 className="font-bold text-sm uppercase text-on-surface">
                  Chi tiết dịch vụ
                </h4>
                <button
                  type="button"
                  onClick={addDetailRow}
                  className="text-xs bg-primary text-white px-3 py-1.5 rounded flex items-center gap-1 hover:bg-primary-fixed-dim"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    add
                  </span>{" "}
                  Thêm Dịch Vụ
                </button>
              </div>

              <div className="overflow-x-auto border border-outline-variant/30 rounded-lg pb-10">
                <table className="w-full text-sm text-left whitespace-nowrap min-w-[1000px]">
                  <thead className="bg-surface-container-low text-xs uppercase font-bold text-on-surface-variant">
                    <tr>
                      <th className="p-3 w-48">Loại dịch vụ</th>
                      <th className="p-3 w-32">Đơn giá</th>
                      <th className="p-3 w-20 text-center">SL</th>
                      <th className="p-3 w-32">Thành tiền</th>
                      <th className="p-3 w-36">Trả trước</th>
                      <th className="p-3 w-32">Còn lại</th>
                      <th className="p-3 w-36">Ngày giao</th>
                      <th className="p-3 w-32">Tình trạng</th>
                      <th className="p-3 w-10 text-center">Xóa</th>
                    </tr>
                  </thead>
                  <tbody>
                    {newTicket.details.map((row) => {
                      const { subtotal, minPrepaid, remaining } =
                        calculateRowInfo(row);
                      const maxPrepaid = subtotal;
                      const isPrepaidValid =
                        row.prepaid_amount >= minPrepaid &&
                        row.prepaid_amount <= maxPrepaid;

                      return (
                        <tr
                          key={row.id}
                          className="border-b border-outline-variant/10"
                        >
                          <td className="p-2 relative">
                            <select
                              className="w-full p-1.5 border rounded outline-none"
                              value={row.service_id}
                              onChange={(e) =>
                                updateDetailRow(
                                  row.id,
                                  "service_id",
                                  e.target.value,
                                )
                              }
                            >
                              <option value="">-- Chọn --</option>
                              {servicesList.map((s) => (
                                <option key={s.service_id} value={s.service_id}>
                                  {s.service_name}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              disabled
                              className="w-full p-1.5 border rounded bg-surface-variant/20 font-medium text-on-surface-variant"
                              value={
                                formatNumberInput(row.service_price) || "0"
                              }
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="number"
                              min="1"
                              className="w-full p-1.5 border rounded text-center"
                              value={row.quantity}
                              onChange={(e) =>
                                updateDetailRow(
                                  row.id,
                                  "quantity",
                                  parseInt(e.target.value) || 1,
                                )
                              }
                            />
                          </td>
                          <td className="p-2 font-bold text-on-surface">
                            {formatCurrency(subtotal)}
                          </td>
                          <td className="p-2 relative">
                            <input
                              type="text"
                              className={`w-full p-1.5 border rounded outline-none ${!isPrepaidValid && row.prepaid_amount > 0 ? "border-error text-error bg-error-container/10" : "focus:border-primary"}`}
                              value={formatNumberInput(row.prepaid_amount)}
                              onChange={(e) => {
                                const rawValue = e.target.value.replace(
                                  /\D/g,
                                  "",
                                );
                                updateDetailRow(
                                  row.id,
                                  "prepaid_amount",
                                  rawValue ? parseFloat(rawValue) : 0,
                                );
                              }}
                            />
                            {!isPrepaidValid && row.prepaid_amount > 0 && (
                              <p className="text-[10px] text-error mt-1 font-bold absolute whitespace-nowrap">
                                {row.prepaid_amount < minPrepaid
                                  ? `Tối thiểu: ${formatNumberInput(minPrepaid)} ₫`
                                  : `Tối đa: ${formatNumberInput(maxPrepaid)} ₫`}
                              </p>
                            )}
                          </td>
                          <td className="p-2 font-bold text-error">
                            {formatCurrency(remaining > 0 ? remaining : 0)}
                          </td>
                          <td className="p-2">
                            <input
                              type="date"
                              className="w-full p-1.5 border rounded outline-none focus:border-primary"
                              value={row.delivery_date}
                              onChange={(e) =>
                                updateDetailRow(
                                  row.id,
                                  "delivery_date",
                                  e.target.value,
                                )
                              }
                            />
                          </td>
                          <td className="p-2">
                            <select
                              className="w-full p-1.5 border rounded font-semibold text-xs outline-none focus:border-primary"
                              value={row.status}
                              onChange={(e) =>
                                updateDetailRow(
                                  row.id,
                                  "status",
                                  e.target.value,
                                )
                              }
                            >
                              <option value="CHƯA GIAO">CHƯA GIAO</option>
                              <option value="ĐÃ GIAO">ĐÃ GIAO</option>
                            </select>
                          </td>
                          <td className="p-2 text-center">
                            <button
                              type="button"
                              onClick={() => removeDetailRow(row.id)}
                              className="text-error hover:bg-error-container/20 p-1 rounded"
                            >
                              <span className="material-symbols-outlined text-[20px]">
                                delete
                              </span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {newTicket.details.length === 0 && (
                      <tr>
                        <td
                          colSpan="9"
                          className="p-8 text-center text-on-surface-variant italic"
                        >
                          Chưa có dịch vụ nào được thêm. Bấm "Thêm Dịch Vụ" để bắt
                          đầu.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {newTicket.details.length > 0 && (
                <div className="mt-6 flex justify-end">
                  <div className="w-80 bg-surface-bright border border-outline-variant/30 rounded-lg p-4 shadow-sm">
                    <div className="flex justify-between text-sm mb-2 text-on-surface-variant">
                      <span>Tổng thành tiền:</span>
                      <span className="font-bold text-on-surface">
                        {formatCurrency(newTicketTotals.subtotal)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm mb-2 text-on-surface-variant">
                      <span>Tổng khách trả trước:</span>
                      <span className="font-bold text-primary">
                        {formatCurrency(newTicketTotals.prepaid)}
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-outline-variant/30 pt-3 mt-3">
                      <span className="font-bold text-on-surface text-base">
                        Tổng tiền còn lại:
                      </span>
                      <span className="font-black text-error text-lg">
                        {formatCurrency(newTicketTotals.remaining)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="p-5 border-t bg-surface-container-low flex justify-end gap-3 rounded-b-xl">
              <button
                onClick={() => setIsTicketModalOpen(false)}
                className="px-6 py-2 rounded-lg font-medium bg-surface-bright border hover:bg-surface-container"
              >
                Hủy
              </button>
              <button
                onClick={handleCreateTicket}
                className="px-8 py-2 bg-primary text-white rounded-lg font-bold shadow-md hover:bg-primary-fixed-dim"
              >
                TẠO PHIẾU (ENTER)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CHI TIẾT PHIẾU (DOUBLE CLICK) */}
      {isDetailModalOpen && selectedTicket && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-xl shadow-lg w-full max-w-5xl flex flex-col max-h-[85vh] animate-in zoom-in-95">
            <div className="p-5 border-b flex justify-between items-center bg-surface-container-low rounded-t-xl">
              <div>
                <h3 className="font-bold text-title-lg">
                  {formatId("SRV", selectedTicket.ticket_id, 4)}
                </h3>
                <p className="text-sm text-on-surface-variant">
                  Khách hàng:{" "}
                  <span className="font-bold text-primary">
                    {selectedTicket.customer_name}
                  </span>{" "}
                  | Ngày lập: {selectedTicket.created_at}
                </p>
              </div>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="material-symbols-outlined hover:text-error bg-surface-bright p-2 rounded-full border"
              >
                close
              </button>
            </div>
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <table className="w-full border border-outline-variant/30 rounded-lg overflow-hidden text-sm text-left">
                <thead className="bg-surface-bright text-xs uppercase text-on-surface-variant font-bold">
                  <tr>
                    <th className="p-3">Loại Dịch Vụ</th>
                    <th className="p-3">Đơn giá</th>
                    <th className="p-3 text-center">SL</th>
                    <th className="p-3">Thành tiền</th>
                    <th className="p-3">Trả trước</th>
                    <th className="p-3">Còn lại</th>
                    <th className="p-3">Ngày giao</th>
                    <th className="p-3 text-center">Tình trạng</th>
                  </tr>
                </thead>
                <tbody>
                  {ticketDetails
                    .filter((d) => d.ticket_id === selectedTicket.ticket_id)
                    .map((d) => (
                      <tr key={d.detail_id} className="border-b">
                        <td className="p-3 font-medium">{d.service_name}</td>
                        <td className="p-3">
                          {formatCurrency(d.service_price)}
                        </td>
                        <td className="p-3 text-center font-bold">
                          {d.quantity}
                        </td>
                        <td className="p-3 font-bold">
                          {formatCurrency(d.subtotal)}
                        </td>
                        <td className="p-3 text-primary font-bold">
                          {formatCurrency(d.prepaid_amount)}
                        </td>
                        <td className="p-3 text-error font-bold">
                          {formatCurrency(d.remaining_amount)}
                        </td>
                        <td className="p-3">{d.delivery_date}</td>
                        <td className="p-3 text-center">
                          <span
                            className={`px-2 py-1 rounded text-[10px] font-bold ${d.status === "ĐÃ GIAO" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                          >
                            {d.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              <div className="mt-6 p-4 bg-surface-bright rounded-lg border border-outline-variant/20 flex justify-between items-center">
                <div>
                  <p className="text-xs text-on-surface-variant font-bold">
                    TỔNG TIỀN PHIẾU
                  </p>
                  <p className="text-2xl font-black text-primary">
                    {formatCurrency(selectedTicket.grand_total)}
                  </p>
                </div>
                <button className="bg-primary text-white px-6 py-2 rounded-lg flex items-center gap-2 font-bold hover:bg-primary-fixed-dim">
                  <span className="material-symbols-outlined">print</span> IN
                  PHIẾU
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteConfirmTicket && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-xl shadow-lg w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-error-container/30 text-error rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-3xl">warning</span>
              </div>
              <h3 className="text-title-lg font-bold text-on-surface mb-2">Xóa Phiếu Dịch Vụ?</h3>
              <p className="text-on-surface-variant text-sm mb-6">
                Bạn có chắc chắn muốn xóa phiếu <span className="font-bold text-on-surface">SRV-{deleteConfirmTicket.ticket_id}</span>? 
                Hành động này không thể hoàn tác.
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setDeleteConfirmTicket(null)}
                  className="px-5 py-2.5 text-sm font-medium bg-surface-container-low text-on-surface hover:bg-surface-variant/30 rounded-lg transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={confirmDeleteTicket}
                  className="px-5 py-2.5 text-sm font-medium bg-error text-white hover:bg-[#b91c1c] rounded-lg transition-colors shadow-sm"
                >
                  Đồng Ý Xóa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </MainLayout>

  );
}
