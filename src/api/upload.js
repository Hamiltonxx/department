import { POST } from "@/lib/request";

// 上传贝壳文件
export async function uploadForBk(data) {
    const url = "/upload_extract_bk";

    return POST(url, data, {
        "Content-Type": "multipart/form-data",
    });
}

// 上传全房通文件
export async function uploadForQFT(data) {
    const url = "/upload_extract_qft";

    return POST(url, data, {
        "Content-Type": "multipart/form-data",
    });
}