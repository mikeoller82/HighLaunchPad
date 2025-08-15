/**
 * Dynamic Pricing System
 * Real-time pricing updates and inventory tracking
 */

export interface PricingRule {
  id: string;
  name: string;
  type: 'discount' | 'markup' | 'fixed_price' | 'tiered' | 'time_based' | 'inventory_based';
  conditions: PricingCondition[];
  action: PricingAction;
  priority: number; // Higher number = higher priority
  active: boolean;
  validFrom?: Date;
  validUntil?: Date;
}

export interface PricingCondition {
  type: 'user_segment' | 'quantity' | 'time_range' | 'inventory_level' | 'traffic_source' | 'location' | 'device_type';
  operator: 'equals' | 'greater_than' | 'less_than' | 'between' | 'in' | 'not_in';
  value: any;
}

export interface PricingAction {
  type: 'percentage_discount' | 'fixed_discount' | 'fixed_price' | 'percentage_markup';
  value: number;
  maxDiscount?: number; // Maximum discount amount
  minPrice?: number; // Minimum allowed price
}

export interface Product {
  id: string;
  name: string;
  basePrice: number;
  currency: string;
  inventory?: {
    total: number;
    available: number;
    reserved: number;
    lowStockThreshold: number;
  };
  variants?: ProductVariant[];
  metadata: Record<string, any>;
}

export interface ProductVariant {
  id: string;
  name: string;
  priceModifier: number; // Amount to add/subtract from base price
  inventory?: {
    total: number;
    available: number;
    reserved: number;
    lowStockThreshold: number;
  };
  attributes: Record<string, string>; // size, color, etc.
}

export interface PriceCalculation {
  productId: string;
  variantId?: string;
  basePrice: number;
  finalPrice: number;
  appliedRules: AppliedRule[];
  savings: number;
  currency: string;
  validUntil?: Date;
  urgencyIndicators: UrgencyIndicator[];
}

export interface AppliedRule {
  ruleId: string;
  ruleName: string;
  type: PricingRule['type'];
  discount: number;
  description: string;
}

export interface UrgencyIndicator {
  type: 'limited_time' | 'limited_quantity' | 'price_increase_warning';
  message: string;
  severity: 'low' | 'medium' | 'high';
  expiresAt?: Date;
}

export interface InventoryUpdate {
  productId: string;
  variantId?: string;
  change: number; // Positive for increase, negative for decrease
  reason: 'sale' | 'restock' | 'reservation' | 'cancellation' | 'adjustment';
  timestamp: Date;
}

export interface PriceHistory {
  productId: string;
  variantId?: string;
  price: number;
  timestamp: Date;
  reason: string;
  appliedRules: string[];
}

export class DynamicPricingSystem {
  private products: Map<string, Product> = new Map();
  private pricingRules: Map<string, PricingRule> = new Map();
  private priceHistory: PriceHistory[] = [];
  private inventoryUpdates: InventoryUpdate[] = [];
  private priceUpdateCallbacks: Map<string, Function[]> = new Map();

  /**
   * Add product to pricing system
   */
  addProduct(product: Product): void {
    this.products.set(product.id, product);
  }

  /**
   * Create pricing rule
   */
  createPricingRule(config: Omit<PricingRule, 'id'>): PricingRule {
    const rule: PricingRule = {
      ...config,
      id: this.generateId()
    };

    this.pricingRules.set(rule.id, rule);
    return rule;
  }

  /**
   * Calculate dynamic price for product
   */
  calculatePrice(productId: string, context: {
    variantId?: string;
    quantity?: number;
    userSegment?: string;
    trafficSource?: string;
    location?: string;
    deviceType?: string;
    timestamp?: Date;
  }): PriceCalculation | null {
    const product = this.products.get(productId);
    if (!product) return null;

    const variant = context.variantId ?
      product.variants?.find(v => v.id === context.variantId) : undefined;

    let basePrice = product.basePrice;
    if (variant) {
      basePrice += variant.priceModifier;
    }

    // Get applicable rules
    const applicableRules = this.getApplicableRules(productId, context);

    // Apply rules in priority order
    const appliedRules: AppliedRule[] = [];
    let finalPrice = basePrice;
    let totalSavings = 0;

    for (const rule of applicableRules) {
      const { newPrice, discount, description } = this.applyRule(finalPrice, rule, context);

      if (discount > 0) {
        appliedRules.push({
          ruleId: rule.id,
          ruleName: rule.name,
          type: rule.type,
          discount,
          description
        });

        finalPrice = newPrice;
        totalSavings += discount;
      }
    }

    // Generate urgency indicators
    const urgencyIndicators = this.generateUrgencyIndicators(product, variant, context);

    // Record price calculation
    this.recordPriceHistory({
      productId,
      variantId: context.variantId,
      price: finalPrice,
      timestamp: context.timestamp || new Date(),
      reason: 'dynamic_calculation',
      appliedRules: appliedRules.map(r => r.ruleId)
    });

    return {
      productId,
      variantId: context.variantId,
      basePrice,
      finalPrice,
      appliedRules,
      savings: totalSavings,
      currency: product.currency,
      validUntil: this.calculatePriceValidUntil(applicableRules),
      urgencyIndicators
    };
  }

  /**
   * Create time-based pricing rule (flash sale, early bird, etc.)
   */
  createTimeBasedPricingRule(config: {
    name: string;
    discountPercentage: number;
    startTime: Date;
    endTime: Date;
    products?: string[];
    userSegments?: string[];
  }): PricingRule {
    return this.createPricingRule({
      name: config.name,
      type: 'time_based',
      conditions: [
        {
          type: 'time_range',
          operator: 'between',
          value: [config.startTime, config.endTime]
        },
        ...(config.products ? [{
          type: 'user_segment' as const,
          operator: 'in' as const,
          value: config.products
        }] : []),
        ...(config.userSegments ? [{
          type: 'user_segment' as const,
          operator: 'in' as const,
          value: config.userSegments
        }] : [])
      ],
      action: {
        type: 'percentage_discount',
        value: config.discountPercentage
      },
      priority: 100,
      active: true,
      validFrom: config.startTime,
      validUntil: config.endTime
    });
  }

  /**
   * Create inventory-based pricing rule
   */
  createInventoryBasedRule(config: {
    name: string;
    productId: string;
    lowStockThreshold: number;
    discountPercentage: number;
    urgencyMessage: string;
  }): PricingRule {
    return this.createPricingRule({
      name: config.name,
      type: 'inventory_based',
      conditions: [
        {
          type: 'inventory_level',
          operator: 'less_than',
          value: config.lowStockThreshold
        }
      ],
      action: {
        type: 'percentage_discount',
        value: config.discountPercentage
      },
      priority: 80,
      active: true
    });
  }

  /**
   * Create quantity-based pricing (bulk discounts)
   */
  createQuantityBasedRule(config: {
    name: string;
    tiers: { minQuantity: number; discountPercentage: number }[];
    products?: string[];
  }): PricingRule[] {
    return config.tiers.map((tier, index) =>
      this.createPricingRule({
        name: `${config.name} - Tier ${index + 1}`,
        type: 'tiered',
        conditions: [
          {
            type: 'quantity',
            operator: 'greater_than',
            value: tier.minQuantity - 1
          }
        ],
        action: {
          type: 'percentage_discount',
          value: tier.discountPercentage
        },
        priority: 50 + index,
        active: true
      })
    );
  }

  /**
   * Update product inventory
   */
  updateInventory(update: Omit<InventoryUpdate, 'timestamp'>): void {
    const product = this.products.get(update.productId);
    if (!product) return;

    const inventoryUpdate: InventoryUpdate = {
      ...update,
      timestamp: new Date()
    };

    if (update.variantId && product.variants) {
      const variant = product.variants.find(v => v.id === update.variantId);
      if (variant?.inventory) {
        variant.inventory.available += update.change;
        variant.inventory.available = Math.max(0, variant.inventory.available);
      }
    } else if (product.inventory) {
      product.inventory.available += update.change;
      product.inventory.available = Math.max(0, product.inventory.available);
    }

    this.inventoryUpdates.push(inventoryUpdate);

    // Trigger price updates if inventory affects pricing
    this.triggerPriceUpdates(update.productId);
  }

  /**
   * Reserve inventory for pending orders
   */
  reserveInventory(productId: string, quantity: number, variantId?: string): boolean {
    const product = this.products.get(productId);
    if (!product) return false;

    let inventory: typeof product.inventory;
    if (variantId && product.variants) {
      const variant = product.variants.find(v => v.id === variantId);
      inventory = variant?.inventory;
    } else {
      inventory = product.inventory;
    }

    if (!inventory || inventory.available < quantity) {
      return false;
    }

    inventory.available -= quantity;
    inventory.reserved += quantity;

    this.updateInventory({
      productId,
      variantId,
      change: -quantity,
      reason: 'reservation'
    });

    return true;
  }

  /**
   * Release reserved inventory
   */
  releaseReservation(productId: string, quantity: number, variantId?: string): void {
    const product = this.products.get(productId);
    if (!product) return;

    let inventory = product.inventory;
    if (variantId && product.variants) {
      const variant = product.variants.find(v => v.id === variantId);
      inventory = variant?.inventory;
    }

    if (inventory) {
      inventory.available += quantity;
      inventory.reserved = Math.max(0, inventory.reserved - quantity);
    }

    this.updateInventory({
      productId,
      variantId,
      change: quantity,
      reason: 'cancellation'
    });
  }

  /**
   * Get current inventory status
   */
  getInventoryStatus(productId: string, variantId?: string): {
    available: number;
    reserved: number;
    total: number;
    isLowStock: boolean;
    stockLevel: 'high' | 'medium' | 'low' | 'out_of_stock';
  } | null {
    const product = this.products.get(productId);
    if (!product) return null;

    let inventory = product.inventory;
    if (variantId && product.variants) {
      const variant = product.variants.find(v => v.id === variantId);
      inventory = variant?.inventory;
    }

    if (!inventory) return null;

    const isLowStock = inventory.available <= inventory.lowStockThreshold;
    let stockLevel: 'high' | 'medium' | 'low' | 'out_of_stock';

    if (inventory.available === 0) {
      stockLevel = 'out_of_stock';
    } else if (inventory.available <= inventory.lowStockThreshold) {
      stockLevel = 'low';
    } else if (inventory.available <= inventory.total * 0.3) {
      stockLevel = 'medium';
    } else {
      stockLevel = 'high';
    }

    return {
      available: inventory.available,
      reserved: inventory.reserved,
      total: inventory.total,
      isLowStock,
      stockLevel
    };
  }

  /**
   * Subscribe to price updates
   */
  onPriceUpdate(productId: string, callback: (price: PriceCalculation) => void): void {
    if (!this.priceUpdateCallbacks.has(productId)) {
      this.priceUpdateCallbacks.set(productId, []);
    }
    this.priceUpdateCallbacks.get(productId)!.push(callback);
  }

  /**
   * Get price history for product
   */
  getPriceHistory(productId: string, variantId?: string, limit = 50): PriceHistory[] {
    return this.priceHistory
      .filter(h => h.productId === productId && h.variantId === variantId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  private getApplicableRules(productId: string, context: any): PricingRule[] {
    const now = new Date();

    return Array.from(this.pricingRules.values())
      .filter(rule => {
        if (!rule.active) return false;
        if (rule.validFrom && now < rule.validFrom) return false;
        if (rule.validUntil && now > rule.validUntil) return false;

        return rule.conditions.every(condition =>
          this.evaluateCondition(condition, productId, context)
        );
      })
      .sort((a, b) => b.priority - a.priority);
  }

  private evaluateCondition(condition: PricingCondition, productId: string, context: any): boolean {
    switch (condition.type) {
      case 'user_segment':
        return this.compareValues(context.userSegment, condition.operator, condition.value);
      case 'quantity':
        return this.compareValues(context.quantity || 1, condition.operator, condition.value);
      case 'time_range':
        const now = new Date();
        if (condition.operator === 'between' && Array.isArray(condition.value)) {
          return now >= condition.value[0] && now <= condition.value[1];
        }
        return false;
      case 'inventory_level':
        const inventory = this.getInventoryStatus(productId, context.variantId);
        return inventory ? this.compareValues(inventory.available, condition.operator, condition.value) : false;
      case 'traffic_source':
        return this.compareValues(context.trafficSource, condition.operator, condition.value);
      case 'location':
        return this.compareValues(context.location, condition.operator, condition.value);
      case 'device_type':
        return this.compareValues(context.deviceType, condition.operator, condition.value);
      default:
        return true;
    }
  }

  private compareValues(actual: any, operator: string, expected: any): boolean {
    switch (operator) {
      case 'equals':
        return actual === expected;
      case 'greater_than':
        return actual > expected;
      case 'less_than':
        return actual < expected;
      case 'between':
        return Array.isArray(expected) && actual >= expected[0] && actual <= expected[1];
      case 'in':
        return Array.isArray(expected) && expected.includes(actual);
      case 'not_in':
        return Array.isArray(expected) && !expected.includes(actual);
      default:
        return false;
    }
  }

  private applyRule(currentPrice: number, rule: PricingRule, context: any): {
    newPrice: number;
    discount: number;
    description: string;
  } {
    const { action } = rule;
    let newPrice = currentPrice;
    let discount = 0;

    switch (action.type) {
      case 'percentage_discount':
        discount = currentPrice * (action.value / 100);
        newPrice = currentPrice - discount;
        break;
      case 'fixed_discount':
        discount = action.value;
        newPrice = currentPrice - discount;
        break;
      case 'fixed_price':
        discount = currentPrice - action.value;
        newPrice = action.value;
        break;
      case 'percentage_markup':
        const markup = currentPrice * (action.value / 100);
        newPrice = currentPrice + markup;
        discount = -markup; // Negative discount for markup
        break;
    }

    // Apply constraints
    if (action.maxDiscount && discount > action.maxDiscount) {
      discount = action.maxDiscount;
      newPrice = currentPrice - discount;
    }

    if (action.minPrice && newPrice < action.minPrice) {
      newPrice = action.minPrice;
      discount = currentPrice - newPrice;
    }

    const description = this.generateRuleDescription(rule, discount);

    return { newPrice, discount, description };
  }

  private generateRuleDescription(rule: PricingRule, discount: number): string {
    switch (rule.type) {
      case 'time_based':
        return `Limited time offer - Save $${discount.toFixed(2)}`;
      case 'inventory_based':
        return `Low stock special - Save $${discount.toFixed(2)}`;
      case 'tiered':
        return `Bulk discount - Save $${discount.toFixed(2)}`;
      default:
        return `${rule.name} - Save $${discount.toFixed(2)}`;
    }
  }

  private generateUrgencyIndicators(product: Product, variant?: ProductVariant, context?: any): UrgencyIndicator[] {
    const indicators: UrgencyIndicator[] = [];

    // Check inventory levels
    const inventory = this.getInventoryStatus(product.id, variant?.id);
    if (inventory?.isLowStock) {
      indicators.push({
        type: 'limited_quantity',
        message: `Only ${inventory.available} left in stock!`,
        severity: inventory.available <= 5 ? 'high' : 'medium'
      });
    }

    // Check for time-based rules
    const timeBasedRules = Array.from(this.pricingRules.values())
      .filter(rule => rule.type === 'time_based' && rule.active && rule.validUntil);

    for (const rule of timeBasedRules) {
      if (rule.validUntil) {
        const timeLeft = rule.validUntil.getTime() - Date.now();
        if (timeLeft > 0 && timeLeft < 24 * 60 * 60 * 1000) { // Less than 24 hours
          indicators.push({
            type: 'limited_time',
            message: `${rule.name} ends soon!`,
            severity: timeLeft < 60 * 60 * 1000 ? 'high' : 'medium', // Less than 1 hour
            expiresAt: rule.validUntil
          });
        }
      }
    }

    return indicators;
  }

  private calculatePriceValidUntil(rules: PricingRule[]): Date | undefined {
    const validUntilDates = rules
      .map(rule => rule.validUntil)
      .filter(date => date !== undefined) as Date[];

    if (validUntilDates.length === 0) return undefined;

    return new Date(Math.min(...validUntilDates.map(d => d.getTime())));
  }

  private recordPriceHistory(record: PriceHistory): void {
    this.priceHistory.push(record);

    // Keep only last 1000 records per product
    const productHistory = this.priceHistory.filter(h => h.productId === record.productId);
    if (productHistory.length > 1000) {
      this.priceHistory = this.priceHistory.filter(h =>
        h.productId !== record.productId ||
        productHistory.slice(-1000).includes(h)
      );
    }
  }

  private triggerPriceUpdates(productId: string): void {
    const callbacks = this.priceUpdateCallbacks.get(productId);
    if (!callbacks) return;

    // Calculate new price with current context
    const newPrice = this.calculatePrice(productId, {});
    if (newPrice) {
      callbacks.forEach(callback => callback(newPrice));
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}

export default DynamicPricingSystem;