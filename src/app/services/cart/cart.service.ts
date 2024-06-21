import { inject, Injectable } from '@angular/core';
import { CapacitorBarcodeScanner } from '@capacitor/barcode-scanner';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from '../storage/storage.service';
import { products } from 'src/app/data/products';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  model: any = null;
  cartStoreName = 'barcode_cart';
  products: any[] = [...products];

  private cart$ = new BehaviorSubject<any>(null);

  get cart() {
    return this.cart$.asObservable();
  }

  private storageService = inject(StorageService);

  constructor() {
    this.getCart();
  }

  async startScan(val?: number) {
    try {
      const result = await CapacitorBarcodeScanner.scanBarcode({
        hint: val || 17,
        cameraDirection: 1,
      });
      console.log(result);
      return result.ScanResult;
    } catch (e) {
      throw e;
    }
  }

  addItemByBarcode(barcode: string) {
    const item = this.products.find((item) => item.barcode == barcode);
    if (!item) {
      throw 'No such item found';
    }
    this.addQuantity(item);
  }

  addQuantity(item: any) {
    console.log(item);

    if (this.model) {
      const index = this.model.items.findIndex(
        (data: any) => data.item_id == item.id
      );

      if (index >= 0) {
        this.model.items[index].quantity += 1;
      } else {
        const items = [
          {
            item_id: item?.id,
            name: item?.name,
            description: item?.description,
            price: +item?.price,
            cover: item?.cover,
            quantity: 1,
          },
        ];

        this.model.items = this.model.items.concat(items);
      }
    } else {
      const item_data = {
        item_id: item?.id,
        name: item?.name,
        description: item?.description,
        price: +item?.price,
        cover: item?.cover,
        quantity: 1,
      };

      this.model = {
        items: [item_data],
      };
    }

    return this.calculate();
  }

  subtractQuantity(item: any) {
    if (this.model) {
      const index = this.model.items.findIndex(
        (data: any) => data.item_id == item.id
      );

      if (index >= 0) {
        if (this.model.items[index]?.quantity > 0) {
          this.model.items[index].quantity -= 1;
        }

        return this.calculate();
      }
    }
    return null;
  }

  calculate() {
    const items = this.model.items.filter((item: any) => item.quantity > 0);

    if (items?.length == 0) {
      this.clearCart();
      return;
    }

    let totalItem = 0;
    let totalPrice = 0;

    for (const element of items) {
      totalItem += element.quantity;
      totalPrice += element.price * element.quantity;
    }

    const grandTotal = totalPrice;

    this.model = {
      ...this.model,
      items,
      totalItem,
      totalPrice,
      grandTotal,
    };

    this.cart$.next(this.model);

    //store data
    this.saveCart(this.model);

    return this.model;
  }

  clearCart() {
    this.storageService.removeStorage(this.cartStoreName);
    this.model = null;
    this.cart$.next(null);
  }

  saveCart(data: any) {
    const model = JSON.stringify(data);
    this.storageService.setStorage(this.cartStoreName, model);
  }

  async getCart() {
    let data: any = this.cart$.value;

    if (!data) {
      data = await this.storageService.getStorage(this.cartStoreName);
      console.log(data);

      if (data?.value) {
        this.model = JSON.parse(data.value);
        console.log(this.model);
        this.cart$.next(this.model);
      }
    }
  }
}
