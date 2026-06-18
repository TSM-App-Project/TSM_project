import React, { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import { api } from "../services/apiClient";
import { formatId, parseId } from "../services/idMapper";

export default function Products() {
  // ========================================================================
  // 1. KHỞI TẠO DỮ LIỆU & STATE CHO PRODUCTS (SẢN PHẨM)
  // ========================================================================
  const [productList, setProductList] = useState([]);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [deleteConfirmProduct, setDeleteConfirmProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    productId: null,
    product_id: "",
    category_id: "",
    product_name: "",
    gold_rate_id: 1,
    weight: 0,
    purchase_price: 0,
    labor_cost: 0,
    supplier_id: "",
    stock_quantity: 0,
    status: "ACTIVE",
  });

  // ========================================================================
  // 2. KHỞI TẠO DỮ LIỆU & STATE CHO CATEGORIES (LOẠI SẢN PHẨM)
  // ========================================================================
  const [categoryList, setCategoryList] = useState([]);
  const [supplierList, setSupplierList] = useState([]);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [deleteConfirmCategory, setDeleteConfirmCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({
    categoryId: null,
    category_id: "",
    profit_percentage: 0,
    category_name: "",
    unit: "Piece",
    status: "ACTIVE",
  });

  // ========================================================================
  // 3. STATE CHUNG TỔNG HỢP (TABS & TÌM KIẾM)
  // ========================================================================
  const [activeTab, setActiveTab] = useState("products"); // 'products' hoặc 'categories'
  const [searchQuery, setSearchQuery] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [pageError, setPageError] = useState("");
  const [modalMode, setModalMode] = useState("add");

  // --- Lắng nghe phím ESC để đóng mọi Modal ---
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsProductModalOpen(false);
        setDeleteConfirmProduct(null);
        setIsCategoryModalOpen(false);
        setDeleteConfirmCategory(null);
      }
    };

    if (
      isProductModalOpen ||
      deleteConfirmProduct ||
      isCategoryModalOpen ||
      deleteConfirmCategory
    ) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [
    isProductModalOpen,
    deleteConfirmProduct,
    isCategoryModalOpen,
    deleteConfirmCategory,
  ]);

  const mapProductFromApi = (product) => ({
    productId: product.productId,
    product_id: formatId("PRD", product.productId),
    category_id: product.category?.categoryId
      ? formatId("CAT", product.category.categoryId)
      : "",
    product_name: product.productName || "",
    gold_rate_id: 1,
    weight: Number(product.weight || 0),
    purchase_price: Number(product.purchasePrice || 0),
    category_profit_percentage: Number(product.category?.profitPercentage || 0),
    labor_cost: Number(product.laborCost || 0),
    supplier_id: product.supplier?.supplierId || "",
    stock_quantity: Number(product.stockQuantity || 0),
    status: product.status || "ACTIVE",
    });

  const mapCategoryFromApi = (category) => ({
    categoryId: category.categoryId,
    category_id: formatId("CAT", category.categoryId),
    profit_percentage: Number(category.profitPercentage || 0),
    category_name: category.categoryName || "",
    unit: category.unitName || "Piece",
    status: category.status || "ACTIVE",
  });

  const loadData = async () => {
    try {
      setPageError("");
      const [products, categories, suppliers] = await Promise.all([
        api.get("/api/products"),
        api.get("/api/product-categories"),
          api.get("/api/suppliers"),
      ]);
      setProductList((products || []).map(mapProductFromApi));
      setCategoryList((categories || []).map(mapCategoryFromApi));
        setSupplierList(suppliers || []);
    } catch (error) {
      setPageError(error.message || "Lỗi khi tải dữ liệu");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ========================================================================
  // 4. LOGIC XỬ LÝ SẢN PHẨM (PRODUCTS)
  // ========================================================================
  const filteredProducts = productList.filter(
    (p) =>
      p.product_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.product_name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleOpenProductAddModal = () => {
    const maxNum = productList.reduce((max, p) => {
      const num = p.productId ?? parseId(p.product_id, "PRD") ?? 0;
      return num > max ? num : max;
    }, 0);

    setProductForm({
      productId: null,
      product_id: `PRD-${(maxNum + 1).toString().padStart(3, "0")}`,
      category_id: "",
      product_name: "",
      gold_rate_id: 1,
      weight: 0,
      purchase_price: 0,
      labor_cost: 0,
      supplier_id: "",
      stock_quantity: 0,
      status: "ACTIVE",
    });
    setModalMode("add");
    setErrorMessage("");
    setIsProductModalOpen(true);
  };

  const handleProductInputChange = (e) => {
    const { name, value } = e.target;
    setProductForm((prev) => {
      const rawData = { ...prev, [name]: value };
      const numberFields = [
        "weight",
        "purchase_price",
        "labor_cost",
        "stock_quantity",
        "gold_rate_id",
      ];
      if (numberFields.includes(name)) {
        rawData[name] = value === "" ? "" : Number(value) || 0;
      }
      return rawData;
    });
    setErrorMessage("");
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    const isDuplicateName = productList.some(
      (p) =>
        p.product_name.toLowerCase() ===
          productForm.product_name.toLowerCase() &&
        p.product_id !== productForm.product_id,
    );
    if (isDuplicateName) {
      setErrorMessage("Tên sản phẩm này đã tồn tại trong hệ thống (QĐ4).");
      return;
    }

    const categoryId = parseId(productForm.category_id, "CAT");
    if (!categoryId) {
      setErrorMessage("Vui lòng chọn một danh mục hợp lệ.");
      return;
    }

    const payload = {
      categoryId,
      productName: productForm.product_name,
      weight: Number(productForm.weight) || 0,
      laborCost: Number(productForm.labor_cost) || 0,
      purchasePrice: Number(productForm.purchase_price) || 0,
      stockQuantity: Number(productForm.stock_quantity) || 0,
      status: productForm.status || "ACTIVE",
      supplierId: productForm.supplier_id ? Number(productForm.supplier_id) : null,
    };

    try {
      if (modalMode === "add") {
        await api.post("/api/products", payload);
      } else {
        await api.put(`/api/products/${productForm.productId}`, payload);
      }
      await loadData();
      setIsProductModalOpen(false);
    } catch (error) {
      setErrorMessage(error.message || "Lỗi khi lưu sản phẩm");
    }
  };

  const confirmDeleteProduct = async () => {
    if (!deleteConfirmProduct) return;

    try {
      await api.put(`/api/products/${deleteConfirmProduct.productId}`, {
        status: "INACTIVE",
      });
      await loadData();
      setDeleteConfirmProduct(null);
    } catch (error) {
      setErrorMessage(error.message || "Lỗi khi ẩn sản phẩm");
    }
  };

  // ========================================================================
  // 5. LOGIC XỬ LÝ LOẠI SẢN PHẨM (CATEGORIES)
  // ========================================================================
  const filteredCategories = categoryList.filter(
    (c) =>
      c.category_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category_name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleOpenCategoryAddModal = () => {
    const maxNum = categoryList.reduce((max, c) => {
      const num = c.categoryId ?? parseId(c.category_id, "CAT") ?? 0;
      return num > max ? num : max;
    }, 0);

    setCategoryForm({
      categoryId: null,
      category_id: `CAT-${(maxNum + 1).toString().padStart(3, "0")}`,
      profit_percentage: 0,
      category_name: "",
      unit: "Piece",
      status: "ACTIVE",
    });
    setModalMode("add");
    setErrorMessage("");
    setIsCategoryModalOpen(true);
  };

  const handleCategoryInputChange = (e) => {
    const { name, value } = e.target;
    setCategoryForm((prev) => ({ ...prev, [name]: value }));
    setErrorMessage("");
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    const isDuplicateName = categoryList.some(
      (c) =>
        c.category_name.toLowerCase() ===
          categoryForm.category_name.toLowerCase() &&
        c.category_id !== categoryForm.category_id,
    );
    if (isDuplicateName) {
      setErrorMessage(
        "Tên danh mục này đã tồn tại. Vui lòng sử dụng tên khác.",
      );
      return;
    }

    const payload = {
      categoryName: categoryForm.category_name,
      unitName: categoryForm.unit,
      profitPercentage: Number(categoryForm.profit_percentage) || 0,
      status: categoryForm.status,
    };

    try {
      if (modalMode === "add") {
        await api.post("/api/product-categories", payload);
      } else {
        await api.put(
          `/api/product-categories/${categoryForm.categoryId}`,
          payload,
        );
      }
      await loadData();
      setIsCategoryModalOpen(false);
    } catch (error) {
      setErrorMessage(error.message || "Lỗi khi lưu danh mục");
    }
  };

  const confirmDeleteCategory = async () => {
    if (!deleteConfirmCategory) return;

    try {
      await api.put(
        `/api/product-categories/${deleteConfirmCategory.categoryId}`,
        { status: "INACTIVE" }
      );
      await loadData();
      setDeleteConfirmCategory(null);
    } catch (error) {
      setErrorMessage(error.message || "Lỗi khi xóa danh mục");
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <MainLayout
      title="Sản Phẩm & Danh Mục"
      subtitle="Quản lý danh mục trang sức, phân loại và thuộc tính"
    >
      {pageError && (
        <div className="mb-4 rounded-lg border border-error/30 bg-error-container/30 px-4 py-3 text-sm text-error">
          {pageError}
        </div>
      )}

      {/* Các thẻ thống kê (Dựa trên dữ liệu Sản phẩm) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-card-padding shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-center justify-between">
          <div>
            <span className="text-sm text-on-surface-variant block mb-1">
              Tổng Sản Phẩm
            </span>
            <span className="font-headline-md text-headline-md font-bold text-on-surface">
              {productList.length}
            </span>
          </div>
          <div className="w-12 h-12 bg-primary-container/30 text-primary rounded-xl flex items-center justify-center">
            <span className="material-symbols-outlined">diamond</span>
          </div>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-card-padding shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-center justify-between">
          <div>
            <span className="text-sm text-on-surface-variant block mb-1">
              Tổng Danh Mục
            </span>
            <span className="font-headline-md text-headline-md font-bold text-on-surface">
              {categoryList.filter((c) => c.status === "ACTIVE").length}
            </span>
          </div>
          <div className="w-12 h-12 bg-tertiary-container/30 text-tertiary rounded-xl flex items-center justify-center">
            <span className="material-symbols-outlined">category</span>
          </div>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-card-padding shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-center justify-between">
          <div>
            <span className="text-sm text-on-surface-variant block mb-1">
              Sắp Hết Hàng
            </span>
            <span className="font-headline-md text-headline-md font-bold text-on-surface text-error">
              {productList.filter((p) => p.stock_quantity <= 5).length}
            </span>
          </div>
          <div className="w-12 h-12 bg-error-container/30 text-error rounded-xl flex items-center justify-center">
            <span className="material-symbols-outlined">inventory_2</span>
          </div>
        </div>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-card-padding shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col">
        {/* --- HEADER TABS & TÌM KIẾM --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          {/* Component Tabs */}
          <div className="flex p-1 bg-surface-container-low rounded-lg inline-flex">
            <button
              onClick={() => {
                setActiveTab("products");
                setSearchQuery("");
              }}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${activeTab === "products" ? "bg-surface-bright text-on-surface shadow-sm" : "text-on-surface-variant hover:text-on-surface"}`}
            >
              Danh Sách Sản Phẩm
            </button>
            <button
              onClick={() => {
                setActiveTab("categories");
                setSearchQuery("");
              }}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${activeTab === "categories" ? "bg-surface-bright text-on-surface shadow-sm" : "text-on-surface-variant hover:text-on-surface"}`}
            >
              Danh Mục Sản Phẩm
            </button>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                search
              </span>
              <input
                type="text"
                placeholder={
                  activeTab === "products"
                    ? "Tìm kiếm Sản phẩm..."
                    : "Tìm kiếm Danh mục..."
                }
                className="w-full pl-10 pr-4 py-2 bg-surface-bright border border-outline-variant/30 text-on-surface text-sm rounded-lg focus:ring-primary focus:border-primary outline-none transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              onClick={
                activeTab === "products"
                  ? handleOpenProductAddModal
                  : handleOpenCategoryAddModal
              }
              className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-fixed-dim transition-colors whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              {activeTab === "products" ? "Thêm Sản Phẩm" : "Thêm Danh Mục"}
            </button>
          </div>
        </div>

        {/* --- BODY RENDERING TABLES DỰA THEO TAB --- */}
        <div className="w-full max-h-[500px] overflow-y-auto custom-scrollbar border border-outline-variant/10 rounded-lg">
          {activeTab === "products" ? (
            /* BẢNG PRODUCTS */
            <table className="w-full text-left border-collapse min-w-[1200px] relative">
              <thead>
                <tr className="text-xs text-on-surface-variant border-b border-outline-variant/20 uppercase tracking-wider bg-surface-container-lowest sticky top-0 z-10 shadow-sm">
                  <th className="pb-3 font-medium px-4 py-3">ID Sản Phẩm</th>
                  <th className="pb-3 font-medium px-4 py-3">Tên Sản Phẩm</th>
                  <th className="pb-3 font-medium px-4 py-3">ID Danh Mục</th>
                  <th className="pb-3 font-medium px-4 py-3">Trọng Lượng</th>
                  <th className="pb-3 font-medium px-4 py-3">Tiền Công</th>
                  <th className="pb-3 font-medium px-4 py-3">Giá Mua</th>
                  <th className="pb-3 font-medium px-4 py-3">Giá Bán</th>
                  <th className="pb-3 font-medium px-4 py-3">Tồn Kho</th>
                  <th className="pb-3 font-medium px-4 py-3">Trạng Thái</th>
                  <th className="pb-3 font-medium px-4 py-3 text-right">
                    Thao Tác
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <tr
                      key={product.product_id}
                      className="border-b border-outline-variant/10 hover:bg-surface-bright transition-colors"
                    >
                      <td className="py-3 px-4 font-medium text-on-surface">
                        {product.product_id}
                      </td>
                      <td
                        className="py-3 px-4 font-medium text-on-surface max-w-[250px] truncate"
                        title={product.product_name}
                      >
                        {product.product_name}
                      </td>
                      <td className="py-3 px-4 text-on-surface-variant">
                        {product.category_id}
                      </td>
                      <td className="py-3 px-4 text-on-surface-variant">
                        {product.weight}
                      </td>
                      <td className="py-3 px-4 font-medium">
                        {formatCurrency(product.labor_cost)}
                      </td>
                      <td className="py-3 px-4 font-medium">
                        {formatCurrency(product.purchase_price)}
                      </td>
                      <td className="py-3 px-4 font-bold text-primary">
                        {formatCurrency(
                          product.purchase_price +
                          product.purchase_price * (product.category_profit_percentage / 100) +
                          product.labor_cost
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`font-bold ${product.stock_quantity <= 5 ? "text-error" : "text-on-surface"}`}
                        >
                          {product.stock_quantity}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${product.status === "ACTIVE" ? "bg-primary" : "bg-outline-variant"}`}
                          ></div>
                          <span
                            className={`text-xs font-bold ${product.status === "ACTIVE" ? "text-primary" : "text-on-surface-variant"}`}
                          >
                            {product.status}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setModalMode("edit");
                            setProductForm({ ...product });
                            setIsProductModalOpen(true);
                          }}
                          className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-primary-container/20 rounded transition-colors"
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
                      colSpan="9"
                      className="py-8 text-center text-on-surface-variant"
                    >
                      Không tìm thấy sản phẩm nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            /* BẢNG CATEGORIES */
            <table className="w-full text-left border-collapse min-w-[800px] relative">
              <thead>
                <tr className="text-xs text-on-surface-variant border-b border-outline-variant/20 uppercase tracking-wider bg-surface-container-lowest sticky top-0 z-10 shadow-sm">
                  <th className="pb-3 font-medium px-4 py-3">ID Danh Mục</th>
                  <th className="pb-3 font-medium px-4 py-3">Phần Trăm Lợi Nhuận (%)</th>
                  <th className="pb-3 font-medium px-4 py-3">Tên Danh Mục</th>
                  <th className="pb-3 font-medium px-4 py-3">Đơn Vị Mặc Định</th>
                  <th className="pb-3 font-medium px-4 py-3">Trạng Thái</th>
                  <th className="pb-3 font-medium px-4 py-3 text-right">
                    Thao Tác
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((cat) => (
                    <tr
                      key={cat.category_id}
                      className="border-b border-outline-variant/10 hover:bg-surface-bright transition-colors"
                    >
                      <td className="py-3 px-4 font-medium text-on-surface">
                        {cat.category_id}
                      </td>
                      <td className="py-3 px-4 font-mono text-xs text-primary font-bold bg-primary-container/20 px-2 py-1 rounded inline-block mt-2 ml-4">
                        {cat.profit_percentage}%
                      </td>
                      <td className="py-3 px-4 font-medium text-on-surface">
                        {cat.category_name}
                      </td>
                      <td className="py-3 px-4 text-on-surface-variant">
                        {cat.unit}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${cat.status === "ACTIVE" ? "bg-primary" : "bg-outline-variant"}`}
                          ></div>
                          <span
                            className={`text-xs font-bold ${cat.status === "ACTIVE" ? "text-primary" : "text-on-surface-variant"}`}
                          >
                            {cat.status}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setModalMode("edit");
                            setCategoryForm({ ...cat });
                            setIsCategoryModalOpen(true);
                          }}
                          className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-primary-container/20 rounded transition-colors"
                          title="Sửa Danh Mục"
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
                      colSpan="6"
                      className="py-8 text-center text-on-surface-variant"
                    >
                      Không tìm thấy danh mục nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ======================= MODALS CHO PRODUCTS ======================= */}
      {isProductModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-xl shadow-lg w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-5 border-b border-outline-variant/20">
              <h3 className="text-title-lg font-semibold text-on-surface">
                {modalMode === "add" ? "Thêm Sản Phẩm Mới" : "Cập Nhật Sản Phẩm"}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="text-on-surface-variant hover:text-error transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form
              onSubmit={handleSaveProduct}
              className="p-5 flex flex-col gap-4"
            >
              {errorMessage && (
                <div className="p-3 bg-error-container/30 border border-error/50 rounded-lg text-error text-sm font-medium">
                  {errorMessage}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Mã Sản Phẩm
                  </label>
                  <input
                    type="text"
                    name="product_id"
                    disabled
                    value={productForm.product_id}
                    className="w-full px-4 py-2 rounded-lg border border-outline-variant/30 bg-surface-container-low text-on-surface-variant font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-on-surface">
                    Mã Danh Mục <span className="text-error">*</span>
                  </label>
                  <select
                    name="category_id"
                    value={productForm.category_id}
                    onChange={handleProductInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-outline-variant/30 bg-surface-bright text-on-surface text-sm focus:ring-primary focus:border-primary outline-none"
                    required
                  >
                    <option value="">Chọn danh mục</option>
                    {categoryList.map((cat) => (
                      <option key={cat.category_id} value={cat.category_id}>
                        {cat.category_id} - {cat.category_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-on-surface">
                    Tên Sản Phẩm <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    name="product_name"
                    value={productForm.product_name}
                    onChange={handleProductInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-outline-variant/30 bg-surface-bright text-on-surface text-sm focus:ring-primary focus:border-primary outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-on-surface">
                    Trọng Lượng
                  </label>
                  <input
                    type="number"
                    name="weight"
                    min="0"
                    step="0.01"
                    required
                    value={productForm.weight}
                    onChange={handleProductInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-outline-variant/30 bg-surface-bright text-on-surface text-sm focus:ring-primary focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-on-surface">
                    Tiền Công
                  </label>
                  <input
                    type="number"
                    name="labor_cost"
                    value={productForm.labor_cost}
                    onChange={handleProductInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-outline-variant/30 bg-surface-bright text-on-surface text-sm focus:ring-primary focus:border-primary outline-none"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-on-surface">
                    Giá Mua
                  </label>
                  <input
                    type="number"
                    name="purchase_price"
                    value={productForm.purchase_price}
                    onChange={handleProductInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-outline-variant/30 bg-surface-bright text-on-surface text-sm focus:ring-primary focus:border-primary outline-none"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-on-surface">
                    Tồn Kho
                  </label>
                  <input
                    type="number"
                    name="stock_quantity"
                    value={productForm.stock_quantity}
                    onChange={handleProductInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-outline-variant/30 bg-surface-bright text-on-surface text-sm focus:ring-primary focus:border-primary outline-none"
                    min="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-on-surface">
                    Nhà Cung Cấp
                  </label>
                  <select
                    name="supplier_id"
                    value={productForm.supplier_id}
                    onChange={handleProductInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-outline-variant/30 bg-surface-bright text-on-surface text-sm focus:ring-primary focus:border-primary outline-none"
                  >
                    <option value="">Chọn Nhà Cung Cấp</option>
                    {supplierList.map((sup) => (
                      <option key={sup.supplierId} value={sup.supplierId}>
                        {sup.supplierName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-on-surface">
                    Trạng Thái
                  </label>
                  <select
                    name="status"
                    value={productForm.status}
                    onChange={handleProductInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-outline-variant/30 bg-surface-bright text-on-surface text-sm focus:ring-primary focus:border-primary outline-none"
                  >
                    <option value="ACTIVE">Hoạt động (ACTIVE)</option>
                    <option value="INACTIVE">Ngừng hoạt động (INACTIVE)</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-5 py-2 rounded-lg text-sm font-medium text-on-surface-variant hover:bg-surface-container-high transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg text-sm font-medium bg-primary text-on-primary hover:bg-primary-fixed-dim transition-colors shadow-sm"
                >
                  {modalMode === "add" ? "Thêm Sản Phẩm" : "Lưu Thay Đổi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirmProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-xl shadow-lg w-full max-w-md p-6 text-center">
            <div className="w-16 h-16 bg-error-container/30 text-error rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-3xl">
                visibility_off
              </span>
            </div>
            <h3 className="text-title-lg font-bold mb-2">
              Xác nhận ẩn Sản Phẩm?
            </h3>
            <p className="text-sm text-on-surface-variant mb-6">
              Bạn có chắc chắn muốn ẩn{" "}
              <span className="font-bold text-on-surface">
                {deleteConfirmProduct.product_name}
              </span>
              ?
            </p>
            <div className="flex justify-center gap-3">
              
              <button
                onClick={confirmDeleteProduct}
                className="px-5 py-2.5 bg-error text-white rounded-lg"
              >
                Đồng Ý Ẩn
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================= MODALS CHO CATEGORIES ======================= */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-xl shadow-lg w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-5 border-b border-outline-variant/20">
              <h3 className="text-title-lg font-semibold text-on-surface">
                {modalMode === "add" ? "Thêm Danh Mục" : "Cập Nhật Danh Mục"}
              </h3>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="text-on-surface-variant hover:text-error transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form
              onSubmit={handleSaveCategory}
              className="p-5 flex flex-col gap-4"
            >
              {errorMessage && (
                <div className="p-3 bg-error-container/30 border border-error/50 rounded-lg text-error text-sm font-medium">
                  {errorMessage}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Mã Danh Mục
                  </label>
                  <input
                    type="text"
                    name="category_id"
                    disabled
                    value={categoryForm.category_id}
                    className="w-full px-4 py-2 rounded-lg border border-outline-variant/30 bg-surface-container-low text-on-surface-variant font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-on-surface">
                    Tên Danh Mục <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    name="category_name"
                    value={categoryForm.category_name}
                    onChange={handleCategoryInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-outline-variant/30 bg-surface-bright text-on-surface text-sm focus:ring-primary focus:border-primary outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-on-surface">
                    Phần Trăm Lợi Nhuận (%)
                  </label>
                  <input
                    type="number"
                    name="profit_percentage"
                    value={categoryForm.profit_percentage}
                    onChange={handleCategoryInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-outline-variant/30 bg-surface-bright text-on-surface text-sm focus:ring-primary focus:border-primary outline-none"
                    min="0"
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-on-surface">
                    Đơn Vị Mặc Định
                  </label>
                  <input
                    type="text"
                    name="unit"
                    value={categoryForm.unit}
                    onChange={handleCategoryInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-outline-variant/30 bg-surface-bright text-on-surface text-sm focus:ring-primary focus:border-primary outline-none"
                    placeholder="vd: Chiếc, Bộ, Đôi"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-on-surface">
                    Trạng Thái
                  </label>
                  <select
                    name="status"
                    value={categoryForm.status}
                    onChange={handleCategoryInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-outline-variant/30 bg-surface-bright text-on-surface text-sm focus:ring-primary focus:border-primary outline-none"
                  >
                    <option value="ACTIVE">Hoạt động (ACTIVE)</option>
                    <option value="INACTIVE">Ngừng hoạt động (INACTIVE)</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-5 py-2 rounded-lg text-sm font-medium text-on-surface-variant hover:bg-surface-container-high transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg text-sm font-medium bg-primary text-on-primary hover:bg-primary-fixed-dim transition-colors shadow-sm"
                >
                  {modalMode === "add" ? "Thêm Danh Mục" : "Lưu Danh Mục"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirmCategory && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-xl shadow-lg w-full max-w-md p-6 text-center">
            <div className="w-16 h-16 bg-error-container/30 text-error rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-3xl">
                visibility_off
              </span>
            </div>
            <h3 className="text-title-lg font-bold mb-2">
              Xác nhận ẩn Danh Mục?
            </h3>
            <p className="text-sm text-on-surface-variant mb-6">
              Bạn có chắc chắn muốn ẩn{" "}
              <span className="font-bold text-on-surface">
                {deleteConfirmCategory.category_name}
              </span>
              ?
            </p>
            <div className="flex justify-center gap-3">
              
              <button
                onClick={confirmDeleteCategory}
                className="px-5 py-2.5 bg-error text-white rounded-lg"
              >
                Đồng Ý Ẩn
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
