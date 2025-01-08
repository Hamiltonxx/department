import { POST } from "@/lib/request";

export function login(data) {
    const url = `/login`;

    return POST(url, data);
}