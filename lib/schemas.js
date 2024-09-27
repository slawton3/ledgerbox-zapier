"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaxDetailSchema = exports.ReceiptSchema = exports.LineItemSchema = exports.ItemSchema = exports.InvoiceSchema = exports.InvoiceBaseSchema = exports.BankStatementSchema = exports.additionalItemsSchema = exports.mapDocumentStatusToColor = exports.documentStatus = exports.mapReviewStatusToColor = exports.reviewStatusDisplayName = exports.reviewStatus = exports.STORAGE_RETENTION_POLICY = void 0;
const zod_1 = require("zod");
// 30 days
exports.STORAGE_RETENTION_POLICY = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
exports.reviewStatus = zod_1.z.enum(["pending", "approved", "rejected"]);
exports.reviewStatusDisplayName = {
    [exports.reviewStatus.enum.pending]: "Review",
    [exports.reviewStatus.enum.approved]: "Approved",
    [exports.reviewStatus.enum.rejected]: "Rejected",
};
const mapReviewStatusToColor = (status) => {
    switch (status) {
        case "pending":
            return "text-muted-foreground";
        case "approved":
            return "text-lime-900";
        case "rejected":
            return "text-destructive";
        default:
            return "text-muted-foreground";
    }
};
exports.mapReviewStatusToColor = mapReviewStatusToColor;
exports.documentStatus = zod_1.z.enum(["processing", "success", "error"]);
const mapDocumentStatusToColor = (status) => {
    switch (status) {
        case "processing":
            return "text-muted-foreground";
        case "success":
            return "text-lime-500";
        case "error":
            return "text-destructive";
        default:
            return "text-muted-foreground";
    }
};
exports.mapDocumentStatusToColor = mapDocumentStatusToColor;
const LineItemSchema = zod_1.z.object({
    Items: zod_1.z.string().nullable().optional(),
    Amount: zod_1.z.number().nullable().optional(),
    Description: zod_1.z.string().nullable().optional(),
    Quantity: zod_1.z.number().nullable().optional(),
    UnitPrice: zod_1.z.number().nullable().optional(),
    ProductCode: zod_1.z.string().nullable().optional(),
    Unit: zod_1.z.string().nullable().optional(),
    Date: zod_1.z.coerce.string().nullable().optional(),
    Tax: zod_1.z.number().nullable().optional(),
    TaxRate: zod_1.z.number().nullable().optional(),
});
exports.LineItemSchema = LineItemSchema;
const additionalItemsSchema = zod_1.z.object({
    FieldName: zod_1.z.string().nullable().optional(),
    FieldValue: zod_1.z.string().nullable().optional(),
});
exports.additionalItemsSchema = additionalItemsSchema;
const BankLineItemsSchema = zod_1.z.object({
    Date: zod_1.z.string().default(""),
    Description: zod_1.z.string().default(""),
    Credits: zod_1.z.coerce.string().default(""),
    Debits: zod_1.z.coerce.string().default(""),
    Balance: zod_1.z.coerce.string().default(""),
});
const BankStatementSchema = zod_1.z.object({
    CustomerName: zod_1.z.string().default(""),
    AccountNumber: zod_1.z.string().default(""),
    BankName: zod_1.z.string().default(""),
    BankAddress: zod_1.z.string().default(""),
    PeriodStartDate: zod_1.z.coerce.string().default(""),
    PeriodEndDate: zod_1.z.coerce.string().default(""),
    StartingBalance: zod_1.z.coerce.string().default(""),
    EndingBalance: zod_1.z.coerce.string().default(""),
    LineItems: zod_1.z.array(BankLineItemsSchema).default([]),
});
exports.BankStatementSchema = BankStatementSchema;
const InvoiceSchema = zod_1.z.object({
    CustomerName: zod_1.z.string().nullable().optional(),
    CustomerId: zod_1.z.string().nullable().optional(),
    PurchaseOrder: zod_1.z.string().nullable().optional(),
    InvoiceId: zod_1.z.string().nullable().optional(),
    InvoiceDate: zod_1.z.coerce.string().nullable().optional(),
    DueDate: zod_1.z.coerce.string().nullable().optional(),
    VendorName: zod_1.z.string().nullable().optional(),
    VendorTaxId: zod_1.z.string().nullable().optional(),
    VendorAddress: zod_1.z.string().nullable().optional(),
    VendorAddressRecipient: zod_1.z.string().nullable().optional(),
    CustomerAddress: zod_1.z.string().nullable().optional(),
    CustomerTaxId: zod_1.z.string().nullable().optional(),
    CustomerAddressRecipient: zod_1.z.string().nullable().optional(),
    BillingAddress: zod_1.z.string().nullable().optional(),
    BillingAddressRecipient: zod_1.z.string().nullable().optional(),
    ShippingAddress: zod_1.z.string().nullable().optional(),
    ShippingAddressRecipient: zod_1.z.string().nullable().optional(),
    PaymentTerm: zod_1.z.string().nullable().optional(),
    SubTotal: zod_1.z.number().nullable().optional(),
    TotalTax: zod_1.z.number().nullable().optional(),
    InvoiceTotal: zod_1.z.number().nullable().optional(),
    AmountDue: zod_1.z.number().nullable().optional(),
    ServiceAddress: zod_1.z.string().nullable().optional(),
    ServiceAddressRecipient: zod_1.z.string().nullable().optional(),
    RemittanceAddress: zod_1.z.string().nullable().optional(),
    RemittanceAddressRecipient: zod_1.z.string().nullable().optional(),
    ServiceStartDate: zod_1.z.coerce.string().nullable().optional(),
    ServiceEndDate: zod_1.z.coerce.string().nullable().optional(),
    PreviousUnpaidBalance: zod_1.z.number().nullable().optional(),
    CurrencyCode: zod_1.z.string().nullable().optional(),
    KVKNumber: zod_1.z.string().nullable().optional(),
    PaymentDetails: zod_1.z.array(zod_1.z.string().nullable()).optional(),
    TotalDiscount: zod_1.z.number().nullable().optional(),
    TaxItems: zod_1.z.array(zod_1.z.string().nullable()).optional(),
    LineItems: zod_1.z.array(LineItemSchema).optional(),
    AdditionalItems: zod_1.z.array(additionalItemsSchema).optional(),
});
exports.InvoiceSchema = InvoiceSchema;
const InvoiceBaseSchema = zod_1.z.object({
    CustomerName: zod_1.z.string().nullable().optional(),
    InvoiceId: zod_1.z.string().nullable().optional(),
    InvoiceDate: zod_1.z.coerce.string().nullable().optional(),
    DueDate: zod_1.z.coerce.string().nullable().optional(),
    VendorName: zod_1.z.string().nullable().optional(),
    VendorAddress: zod_1.z.string().nullable().optional(),
    LineItems: zod_1.z.array(LineItemSchema).nullable().optional(),
});
exports.InvoiceBaseSchema = InvoiceBaseSchema;
const ItemSchema = zod_1.z.object({
    TotalPrice: zod_1.z.number().nullable().optional(),
    Description: zod_1.z.string().nullable().optional(),
    Quantity: zod_1.z.number().nullable().optional(),
    Price: zod_1.z.number().nullable().optional(),
    ProductCode: zod_1.z.string().nullable().optional(),
    QuantityUnit: zod_1.z.string().nullable().optional(),
});
exports.ItemSchema = ItemSchema;
const TaxDetailSchema = zod_1.z.object({
    Amount: zod_1.z.number().nullable().optional(),
});
exports.TaxDetailSchema = TaxDetailSchema;
const ReceiptSchema = zod_1.z.object({
    MerchantName: zod_1.z.string().nullable().optional(),
    MerchantPhoneNumber: zod_1.z.string().nullable().optional(),
    MerchantAddress: zod_1.z.string().nullable().optional(),
    Total: zod_1.z.number().nullable().optional(),
    TransactionDate: zod_1.z.coerce.string().nullable().optional(),
    TransactionTime: zod_1.z.coerce.string().nullable().optional(),
    Subtotal: zod_1.z.number().nullable().optional(),
    TotalTax: zod_1.z.number().nullable().optional(),
    Tip: zod_1.z.number().nullable().optional(),
    Items: zod_1.z.array(ItemSchema).nullable().optional(),
    TaxDetails: zod_1.z.array(TaxDetailSchema).nullable().optional(),
    AdditionalItems: zod_1.z.array(additionalItemsSchema).nullable().optional(),
});
exports.ReceiptSchema = ReceiptSchema;
