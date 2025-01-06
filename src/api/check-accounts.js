import { GET } from "@/lib/request";

export function getData({ current, size }) {
    const url = `/invoice?pageno=${ current }&limit=${ size }`;

    return GET(url);
}