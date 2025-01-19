import { POST } from "@/lib/request";

export function getData(params) {
    const url = `/channel_group`;

    return POST(url, params);
}