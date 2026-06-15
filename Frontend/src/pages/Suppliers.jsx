import React, { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import { api } from "../services/apiClient";

export default function Suppliers() {
  const [supplierList, setSupplierList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [pageError, setPageError] = useState("");

  // State Modal Thêm/Sửa
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [formData, setFormData] = useState({
    supplierId: null,
    id: "",
    name: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    status: "Đang giao dịch",
    debt: 0,
    taxCode: "",
  });

  // State Modal Xác nhận Ngừng giao dịch (Soft-Delete)
  const [suspendConfirmSupplier, setSuspendConfirmSupplier] = useState(null);

  // --- Logic Lọc danh sách (Search bằng Mã hoặc Tên) ---
  const filteredSuppliers = supplierList.filter(
    (s) =>
      s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const formatSupplierId = (id) => `sup_${String(id).padStart(3, "0")}`;

  const mapStatusFromDb = (status) =>
    status === "ACTIVE" ? "Đang giao dịch" : "Ngừng giao dịch";
  const mapStatusToDb = (status) =>
    status === "Đang giao dịch" ? "ACTIVE" : "INACTIVE";

  const mapSupplierFromApi = (supplier) => ({
    supplierId: supplier.supplierId,
    id: formatSupplierId(supplier.supplierId),
    name: supplier.supplierName || "",
    contactPerson: "",
    email: "",
    phone: supplier.phone || "",
    address: supplier.address || "",
    status: mapStatusFromDb(supplier.status),
    debt: Number(supplier.totalDebt || 0),
    taxCode: supplier.taxCode || "",
  });

  const loadSuppliers = async () => {
    try {
      setPageError("");
      const suppliers = await api.get("/api/suppliers");
      setSupplierList((suppliers || []).map(mapSupplierFromApi));
    } catch (error) {
      setPageError(error.message || "Failed to load suppliers");
    }
  };

  useEffect(() => {
    loadSuppliers();
  }, []);

  // --- Logic Thêm/Sửa ---
  const handleOpenAddModal = () => {
    // Tìm số ID lớn nhất trong chuỗi 'sup_XXX' để tự tăng
    const maxNum = supplierList.reduce((max, s) => {
      const num = parseInt(s.id.replace("sup_", ""), 10);
      return !isNaN(num) && num > max ? num : max;
    }, 0);

    setFormData({
      supplierId: null,
      id: `sup_${(maxNum + 1).toString().padStart(3, "0")}`,
      name: "",
      contactPerson: "",
      email: "",
      phone: "",
      address: "",
      status: "Đang giao dịch",
      debt: 0,
      taxCode: "",
    });
    setModalMode("add");
    setErrorMessage("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (supplier) => {
    setFormData({ ...supplier });
    setModalMode("edit");
    setErrorMessage("");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrorMessage("");
  };

  const handleSave = async (e) => {
    e.preventDefault();

    // RULE QĐ6: Kiểm tra Tên nhà cung cấp không được trùng lặp
    const isDuplicateName = supplierList.some(
      (s) =>
        s.name.toLowerCase() === formData.name.toLowerCase() &&
        s.id !== formData.id,
    );

    if (isDuplicateName) {
      setErrorMessage("Tên nhà cung cấp này đã tồn tại trong hệ thống!");
      return;
    }

    const payload = {
      supplierName: formData.name,
      phone: formData.phone,
      address: formData.address,
      taxCode: formData.taxCode || null,
      totalDebt: Number(formData.debt) || 0,
      status: mapStatusToDb(formData.status),
    };

    try {
      if (modalMode === "add") {
        await api.post("/api/suppliers", payload);
      } else {
        await api.put(`/api/suppliers/${formData.supplierId}`, payload);
      }
      await loadSuppliers();
      setIsModalOpen(false);
    } catch (error) {
      setErrorMessage(error.message || "Failed to save supplier");
    }
  };

  // --- Logic Ngừng giao dịch (QĐ6 Soft-Delete) ---
  const confirmSuspend = async () => {
    if (!suspendConfirmSupplier) return;

    try {
      await api.put(`/api/suppliers/${suspendConfirmSupplier.supplierId}`, {
        status: "INACTIVE",
      });
      await loadSuppliers();
      setSuspendConfirmSupplier(null);
    } catch (error) {
      setErrorMessage(error.message || "Failed to update supplier");
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key == "Escape") {
        handleCloseModal();
        setSuspendConfirmSupplier(null);
      }
    };

    if (isModalOpen || suspendConfirmSupplier) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  });
  // --- Format Tiền Tệ ---
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <MainLayout
      title="Nhà Cung Cấp"
      subtitle="Quản lý nhà cung cấp Trang sức & Đá quý"
    >
      {pageError && (
        <div className="mb-4 rounded-lg border border-error/30 bg-error-container/30 px-4 py-3 text-sm text-error">
          {pageError}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-card-padding shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-center justify-between">
          <div>
            <span className="text-sm text-on-surface-variant block mb-1">
              Tổng số Nhà cung cấp
            </span>
            <span className="font-headline-md text-headline-md font-bold text-on-surface">
              {supplierList.length}
            </span>
          </div>
          <div className="w-12 h-12 bg-primary-container/30 text-primary rounded-xl flex items-center justify-center">
            <span className="material-symbols-outlined">diamond</span>
          </div>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-card-padding shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-center justify-between">
          <div>
            <span className="text-sm text-on-surface-variant block mb-1">
              Đang giao dịch
            </span>
            <span className="font-headline-md text-headline-md font-bold text-on-surface">
              {supplierList.filter((s) => s.status === "Đang giao dịch").length}
            </span>
          </div>
          <div className="w-12 h-12 bg-tertiary-container/30 text-tertiary rounded-xl flex items-center justify-center">
            <span className="material-symbols-outlined">check_circle</span>
          </div>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-card-padding shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-center justify-between">
          <div>
            <span className="text-sm text-on-surface-variant block mb-1">
              Tổng công nợ hiện tại
            </span>
            <span className="font-headline-md text-headline-md font-bold text-on-surface text-error">
              {formatCurrency(supplierList.reduce((sum, s) => sum + s.debt, 0))}
            </span>
          </div>
          <div className="w-12 h-12 bg-error-container/30 text-error rounded-xl flex items-center justify-center">
            <span className="material-symbols-outlined">
              account_balance_wallet
            </span>
          </div>
        </div>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-card-padding shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col">
        {/* Thanh Tìm kiếm và Nút Thêm */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="relative w-full md:w-80">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
              search
            </span>
            <input
              type="text"
              placeholder="Tìm kiếm theo Mã (sup_001) hoặc Tên..."
              className="w-full pl-10 pr-4 py-2 bg-surface-bright border border-outline-variant/30 text-on-surface text-sm rounded-lg focus:ring-primary focus:border-primary outline-none transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-fixed-dim transition-colors whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>{" "}
            Thêm Nhà Cung Cấp
          </button>
        </div>

        {/* Bảng dữ liệu */}
        <div className="w-full max-h-[500px] overflow-y-auto custom-scrollbar border border-outline-variant/10 rounded-lg">
          <table className="w-full text-left border-collapse min-w-[1000px] relative">
            <thead>
              <tr className="text-xs text-on-surface-variant border-b border-outline-variant/20 uppercase tracking-wider bg-surface-container-lowest sticky top-0 z-10 shadow-sm">
                <th className="pb-3 font-medium px-4 py-3 bg-surface-container-lowest">
                  ID NCC
                </th>
                <th className="pb-3 font-medium px-4 py-3 bg-surface-container-lowest">
                  Tên NCC
                </th>
                <th className="pb-3 font-medium px-4 py-3 bg-surface-container-lowest">
                  Người Liên Hệ
                </th>
                <th className="pb-3 font-medium px-4 py-3 bg-surface-container-lowest">
                  Số Điện Thoại
                </th>
                <th className="pb-3 font-medium px-4 py-3 bg-surface-container-lowest">
                  Tổng Công Nợ
                </th>
                <th className="pb-3 font-medium px-4 py-3 bg-surface-container-lowest">
                  Trạng Thái
                </th>
                <th className="pb-3 font-medium px-4 py-3 text-right bg-surface-container-lowest">
                  Thao Tác
                </th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredSuppliers.length > 0 ? (
                filteredSuppliers.map((supplier) => (
                  <tr
                    key={supplier.id}
                    className="border-b border-outline-variant/10 hover:bg-surface-bright transition-colors"
                  >
                    <td className="py-3 px-4 font-medium text-on-surface">
                      {supplier.id}
                    </td>
                    <td className="py-3 px-4 font-medium text-on-surface">
                      {supplier.name}
                    </td>
                    <td className="py-3 px-4 text-on-surface-variant">
                      <div className="flex flex-col">
                        <span>{supplier.contactPerson}</span>
                        <span className="text-xs text-outline opacity-70">
                          {supplier.email}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-on-surface-variant">
                      {supplier.phone}
                    </td>
                    <td
                      className={`py-3 px-4 font-bold ${supplier.debt > 0 ? "text-error" : "text-primary"}`}
                    >
                      {formatCurrency(supplier.debt)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${supplier.status === "Đang giao dịch" ? "bg-primary" : "bg-outline-variant"}`}
                        ></div>
                        <span
                          className={`text-xs font-bold ${supplier.status === "Đang giao dịch" ? "text-primary" : "text-on-surface-variant"}`}
                        >
                          {supplier.status}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 flex justify-end gap-2">
                      <button
                        onClick={() => handleOpenEditModal(supplier)}
                        className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-primary-container/20 rounded transition-colors"
                        title="Chỉnh sửa"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          edit_square
                        </span>
                      </button>

                      {/* Chỉ hiện nút Ngừng giao dịch nếu trạng thái đang là Đang giao dịch */}
                      {supplier.status === "Đang giao dịch" && (
                        <button
                          onClick={() => setSuspendConfirmSupplier(supplier)}
                          className="p-1.5 text-on-surface-variant hover:text-error hover:bg-error-container/20 rounded transition-colors"
                          title="Ngừng giao dịch"
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            block
                          </span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="py-8 text-center text-on-surface-variant"
                  >
                    Không tìm thấy nhà cung cấp nào phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ======================= GIAO DIỆN MODAL THÊM/SỬA ======================= */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-xl shadow-lg w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-5 border-b border-outline-variant/20">
              <h3 className="text-title-lg font-semibold text-on-surface">
                {modalMode === "add"
                  ? "Thêm Nhà Cung Cấp (BM15)"
                  : "Cập nhật Nhà Cung Cấp"}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-on-surface-variant hover:text-error transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 flex flex-col gap-4">
              {errorMessage && (
                <div className="p-3 bg-error-container/30 border border-error/50 rounded-lg flex items-center gap-2 text-error text-sm font-medium">
                  <span className="material-symbols-outlined text-[18px]">
                    error
                  </span>
                  {errorMessage}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">
                    Mã NCC
                  </label>
                  <input
                    type="text"
                    disabled
                    value={formData.id}
                    className="w-full p-2.5 bg-surface-variant/30 text-on-surface-variant border border-outline-variant/30 rounded-lg cursor-not-allowed font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">
                    Tên Nhà Cung Cấp <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Công ty Vàng Bạc..."
                    className="w-full p-2.5 bg-surface-bright border border-outline-variant/50 text-on-surface rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">
                    Người liên hệ
                  </label>
                  <input
                    type="text"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleInputChange}
                    placeholder="Nguyễn Văn A"
                    className="w-full p-2.5 bg-surface-bright border border-outline-variant/50 text-on-surface rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">
                    Số điện thoại <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="0901234567"
                    className="w-full p-2.5 bg-surface-bright border border-outline-variant/50 text-on-surface rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-on-surface mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="email@congty.com"
                    className="w-full p-2.5 bg-surface-bright border border-outline-variant/50 text-on-surface rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-on-surface mb-1">
                    Địa chỉ <span className="text-error">*</span>
                  </label>
                  <textarea
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Địa chỉ trụ sở chính"
                    rows="2"
                    className="w-full p-2.5 bg-surface-bright border border-outline-variant/50 text-on-surface rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
                  ></textarea>
                </div>
              </div>

              {modalMode === "edit" && (
                <div className="mt-2">
                  <label className="block text-sm font-medium text-on-surface mb-1">
                    Trạng thái (QĐ6)
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full p-2.5 bg-surface-bright border border-outline-variant/50 text-on-surface rounded-lg focus:ring-2 focus:ring-primary outline-none"
                  >
                    <option value="Đang giao dịch">Đang giao dịch</option>
                    <option value="Ngừng giao dịch">Ngừng giao dịch</option>
                  </select>
                </div>
              )}

              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-sm font-medium text-on-surface-variant hover:bg-surface-variant/50 rounded-lg transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium bg-primary text-on-primary hover:bg-primary-fixed-dim rounded-lg transition-colors shadow-sm"
                >
                  {modalMode === "add" ? "Thêm Mới" : "Lưu Thay Đổi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================= GIAO DIỆN MODAL SOFT-DELETE (NGỪNG GIAO DỊCH) ======================= */}
      {suspendConfirmSupplier && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-xl shadow-lg w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-error-container/30 text-error rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-3xl">
                  block
                </span>
              </div>
              <h3 className="text-title-lg font-bold text-on-surface mb-2">
                Xác nhận Ngừng giao dịch?
              </h3>
              <p className="text-on-surface-variant text-sm mb-4">
                Bạn có chắc chắn muốn ngừng giao dịch với{" "}
                <span className="font-bold text-on-surface">
                  {" "}
                  {suspendConfirmSupplier.name}{" "}
                </span>{" "}
                không?
              </p>
              <p className="text-error text-xs mb-6 bg-error-container/20 p-2 rounded-lg border border-error/20">
                LƯU Ý QĐ6: Hành động này sẽ khóa chức năng nhập hàng mới. Dữ
                liệu công nợ ({formatCurrency(suspendConfirmSupplier.debt)}) và
                lịch sử nhập hàng cũ vẫn được giữ nguyên.
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setSuspendConfirmSupplier(null)}
                  className="px-5 py-2.5 text-sm font-medium bg-surface-container-low text-on-surface hover:bg-surface-container-high rounded-lg transition-colors"
                >
                  Đóng
                </button>
                <button
                  onClick={confirmSuspend}
                  className="px-5 py-2.5 text-sm font-medium bg-error text-white hover:bg-[#b91c1c] rounded-lg transition-colors shadow-sm flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">
                    block
                  </span>{" "}
                  Áp dụng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
