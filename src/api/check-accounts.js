import { POST } from "@/lib/request";

export function getData({ current, size }, data) {
    const url = `/invoice?pageno=${ current }&limit=${ size }`;

    return POST(url, data);
}