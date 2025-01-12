import { POST } from "@/lib/request";

export function getShopDataDetail(data) {
    const url = `/category_group`;

    return POST(url, data);
}