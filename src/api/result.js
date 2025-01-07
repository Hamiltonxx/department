import { POST } from "@/lib/request";

export function getShop(data) {
    const url = `/shops_during`;

    return POST(url, data);
}


export function getShopData(data) {
    const url = `/income_expense`;

    return POST(url, data);
}

export function getShopDataDetail(data) {
    const url = `/category_during`;

    return POST(url, data);
}