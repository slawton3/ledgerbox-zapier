import { z } from "zod"

// 30 days
export const STORAGE_RETENTION_POLICY = new Date(
  Date.now() - 30 * 24 * 60 * 60 * 1000
)

export const reviewStatus = z.enum(["pending", "approved", "rejected"])
export type ReviewStatus = z.infer<typeof reviewStatus>
export const reviewStatusDisplayName = {
  [reviewStatus.enum.pending]: "Review",
  [reviewStatus.enum.approved]: "Approved",
  [reviewStatus.enum.rejected]: "Rejected",
}

export const mapReviewStatusToColor = (status: ReviewStatus) => {
  switch (status) {
    case "pending":
      return "text-muted-foreground"
    case "approved":
      return "text-lime-900"
    case "rejected":
      return "text-destructive"
    default:
      return "text-muted-foreground"
  }
}

export const documentStatus = z.enum(["processing", "success", "error"])
export type DocumentStatus = z.infer<typeof documentStatus>

export const mapDocumentStatusToColor = (status: DocumentStatus) => {
  switch (status) {
    case "processing":
      return "text-muted-foreground"
    case "success":
      return "text-lime-500"
    case "error":
      return "text-destructive"
    default:
      return "text-muted-foreground"
  }
}

const LineItemSchema = z.object({
  Items: z.string().nullable().optional(),
  Amount: z.number().nullable().optional(),
  Description: z.string().nullable().optional(),
  Quantity: z.number().nullable().optional(),
  UnitPrice: z.number().nullable().optional(),
  ProductCode: z.string().nullable().optional(),
  Unit: z.string().nullable().optional(),
  Date: z.coerce.string().nullable().optional(),
  Tax: z.number().nullable().optional(),
  TaxRate: z.number().nullable().optional(),
})

const additionalItemsSchema = z.object({
  FieldName: z.string().nullable().optional(),
  FieldValue: z.string().nullable().optional(),
})

const BankLineItemsSchema = z.object({
  Date: z.string().default(""),
  Description: z.string().default(""),
  Credits: z.coerce.string().default(""),
  Debits: z.coerce.string().default(""),
  Balance: z.coerce.string().default(""),
})

const BankStatementSchema = z.object({
  CustomerName: z.string().default(""),
  AccountNumber: z.string().default(""),
  BankName: z.string().default(""),
  BankAddress: z.string().default(""),
  PeriodStartDate: z.coerce.string().default(""),
  PeriodEndDate: z.coerce.string().default(""),
  StartingBalance: z.coerce.string().default(""),
  EndingBalance: z.coerce.string().default(""),
  LineItems: z.array(BankLineItemsSchema).default([]),
})

const InvoiceSchema = z.object({
  CustomerName: z.string().nullable().optional(),
  CustomerId: z.string().nullable().optional(),
  PurchaseOrder: z.string().nullable().optional(),
  InvoiceId: z.string().nullable().optional(),
  InvoiceDate: z.coerce.string().nullable().optional(),
  DueDate: z.coerce.string().nullable().optional(),
  VendorName: z.string().nullable().optional(),
  VendorTaxId: z.string().nullable().optional(),
  VendorAddress: z.string().nullable().optional(),
  VendorAddressRecipient: z.string().nullable().optional(),
  CustomerAddress: z.string().nullable().optional(),
  CustomerTaxId: z.string().nullable().optional(),
  CustomerAddressRecipient: z.string().nullable().optional(),
  BillingAddress: z.string().nullable().optional(),
  BillingAddressRecipient: z.string().nullable().optional(),
  ShippingAddress: z.string().nullable().optional(),
  ShippingAddressRecipient: z.string().nullable().optional(),
  PaymentTerm: z.string().nullable().optional(),
  SubTotal: z.number().nullable().optional(),
  TotalTax: z.number().nullable().optional(),
  InvoiceTotal: z.number().nullable().optional(),
  AmountDue: z.number().nullable().optional(),
  ServiceAddress: z.string().nullable().optional(),
  ServiceAddressRecipient: z.string().nullable().optional(),
  RemittanceAddress: z.string().nullable().optional(),
  RemittanceAddressRecipient: z.string().nullable().optional(),
  ServiceStartDate: z.coerce.string().nullable().optional(),
  ServiceEndDate: z.coerce.string().nullable().optional(),
  PreviousUnpaidBalance: z.number().nullable().optional(),
  CurrencyCode: z.string().nullable().optional(),
  KVKNumber: z.string().nullable().optional(),
  PaymentDetails: z.array(z.string().nullable()).optional(),
  TotalDiscount: z.number().nullable().optional(),
  TaxItems: z.array(z.string().nullable()).optional(),
  LineItems: z.array(LineItemSchema).optional(),
  AdditionalItems: z.array(additionalItemsSchema).optional(),
})

const InvoiceBaseSchema = z.object({
  CustomerName: z.string().nullable().optional(),
  InvoiceId: z.string().nullable().optional(),
  InvoiceDate: z.coerce.string().nullable().optional(),
  DueDate: z.coerce.string().nullable().optional(),
  VendorName: z.string().nullable().optional(),
  VendorAddress: z.string().nullable().optional(),
  LineItems: z.array(LineItemSchema).nullable().optional(),
})

const ItemSchema = z.object({
  TotalPrice: z.number().nullable().optional(),
  Description: z.string().nullable().optional(),
  Quantity: z.number().nullable().optional(),
  Price: z.number().nullable().optional(),
  ProductCode: z.string().nullable().optional(),
  QuantityUnit: z.string().nullable().optional(),
})

const TaxDetailSchema = z.object({
  Amount: z.number().nullable().optional(),
})

const ReceiptSchema = z.object({
  MerchantName: z.string().nullable().optional(),
  MerchantPhoneNumber: z.string().nullable().optional(),
  MerchantAddress: z.string().nullable().optional(),
  Total: z.number().nullable().optional(),
  TransactionDate: z.coerce.string().nullable().optional(),
  TransactionTime: z.coerce.string().nullable().optional(),
  Subtotal: z.number().nullable().optional(),
  TotalTax: z.number().nullable().optional(),
  Tip: z.number().nullable().optional(),
  Items: z.array(ItemSchema).nullable().optional(),
  TaxDetails: z.array(TaxDetailSchema).nullable().optional(),
  AdditionalItems: z.array(additionalItemsSchema).nullable().optional(),
})

type BankStatement = z.infer<typeof BankStatementSchema>
type BankLineItem = z.infer<typeof BankLineItemsSchema>
type Invoice = z.infer<typeof InvoiceSchema>
type LineItem = z.infer<typeof LineItemSchema>
type InvoiceBase = z.infer<typeof InvoiceBaseSchema>
type AdditionalField = z.infer<typeof additionalItemsSchema>

type Receipt = z.infer<typeof ReceiptSchema>
type Item = z.infer<typeof ItemSchema>
type TaxDetail = z.infer<typeof TaxDetailSchema>

export {
  additionalItemsSchema,
  BankStatementSchema,
  InvoiceBaseSchema,
  InvoiceSchema,
  ItemSchema,
  LineItemSchema,
  ReceiptSchema,
  TaxDetailSchema,
}
export type {
  AdditionalField,
  BankLineItem,
  BankStatement,
  Invoice,
  InvoiceBase,
  Item,
  LineItem,
  Receipt,
  TaxDetail,
}
