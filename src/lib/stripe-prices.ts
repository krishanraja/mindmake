/**
 * Canonical Stripe product and price IDs for Mindmaker offers.
 *
 * Workshop and Cohort price IDs are referential only. Maven collects
 * payment for those offers. The Alumni Pass is the only product the
 * site itself charges via Stripe Checkout. Even then, the live checkout
 * flow is invitation-gated: Krish confirms eligibility post-engagement
 * and sends a direct payment link.
 */

export const STRIPE_PRODUCTS = {
  cohort: {
    productId: "prod_USNA15ZWgGXV8g",
    priceFull: "price_1TXOxvHGqJqsGEJL3kXZuIvQ", // $2,500
    priceSplit: "price_1TXOyLHGqJqsGEJLaUhx0tqy", // $1,250 x 2
  },
  workshops: {
    chiefOfStaff: {
      productId: "prod_UWRs6T1jsfOUPv",
      priceId: "price_1TXOyaHGqJqsGEJLMcgiJm5P",
    },
    orgChart: {
      productId: "prod_UWRs7a0MQrfh8r",
      priceId: "price_1TXOynHGqJqsGEJLnvSNllGd",
    },
    vibeCoding: {
      productId: "prod_UWRsdH5CnPKYX8",
      priceId: "price_1TXOz0HGqJqsGEJLHpaldRq4",
    },
    autonomous: {
      productId: "prod_UWRsGAcNqSNm2M",
      priceId: "price_1TXOzBHGqJqsGEJLkqkjl333",
    },
    memory: {
      productId: "prod_UWRtMdw8iua8Ej",
      priceId: "price_1TXOzNHGqJqsGEJLroBYourW",
    },
  },
  alumniPass: {
    productId: "prod_UWRtT59kvz7mk6",
    priceId: "price_1TXOzcHGqJqsGEJLjN7P4ddi", // $1,500/year recurring
  },
} as const;

export const MAVEN_INSTRUCTOR_URL = "https://maven.com/mindmaker";
export const MAVEN_COHORT_URL =
  "https://maven.com/mindmaker/the-ai-fluent-executive";

// Workshops are not yet published on Maven. Until they are, the CTA on
// each workshop sub-page points to the Maven instructor page and reads
// "Get notified". Once a workshop is live, swap its URL here.
export const WORKSHOP_MAVEN_URLS = {
  chiefOfStaff: MAVEN_INSTRUCTOR_URL,
  orgChart: MAVEN_INSTRUCTOR_URL,
  vibeCoding: MAVEN_INSTRUCTOR_URL,
  autonomous: MAVEN_INSTRUCTOR_URL,
  memory: MAVEN_INSTRUCTOR_URL,
} as const;
