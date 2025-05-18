import React, { useEffect, useState } from "react";
import { InboxOutlined, CopyOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { Upload, message } from "antd";
import { presignedUrl, getBucketImgs } from "../service";
import axios from "axios";
const { Dragger } = Upload;

const UploadPage: React.FC = () => {
  const [bucketImgs, setBucketImgs] = useState<string[]>([]);
  const props: UploadProps = {
    name: "file",
    multiple: true,
    action: async (file) => {
      const res = await presignedUrl(file.name);
      return res.data.data;
    },
    async customRequest(options) {
      const { onSuccess, file, action } = options;
      const fileObj = file as File;
      const res = await axios.put(action, file, {
        headers: {
          "Content-Type": fileObj.type,
        },
      });
      onSuccess!(res.data);
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
    onChange(info) {
      const { status } = info.file;
      if (status === "done") {
        message.success(`${info.file.name} 上传成功`);
        // 刷新图片列表
        getBucketImgs()
          .then((res) => {
            console.log("Bucket images response:", res.data.data);
            setBucketImgs(res.data.data);
          })
          .catch((error) => {
            console.error("Error fetching bucket images:", error);
            message.error("获取图片列表失败");
          });
      } else if (status === "error") {
        message.error(`${info.file.name} 上传失败`);
      }
    },
  };

  useEffect(() => {
    getBucketImgs()
      .then((res) => {
        console.log("Bucket images response:", res.data.data);
        setBucketImgs(res.data.data);
      })
      .catch((error) => {
        console.error("Error fetching bucket images:", error);
        message.error("获取图片列表失败");
      });
  }, []);

  const handleCopyUrl = (imgName: string) => {
    const url = `http://localhost:9000/blog-imgs/${imgName}`;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        message.success("链接已复制到剪贴板");
      })
      .catch(() => {
        message.error("复制失败，请手动复制");
      });
  };

  return (
    <div className="h-full min-h-[calc(100vh-64px)] p-6">
      <div className="text-2xl font-bold mb-6">图片上传</div>

      <div className="mb-8">
        <Dragger {...props} className="mb-8">
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
          <p className="ant-upload-hint">支持单个或批量上传。</p>
        </Dragger>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-6">
        {bucketImgs.map((img: any) => (
          <div
            key={img.name}
            className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="aspect-square relative">
              <img
                src={`http://localhost:9000/blog-imgs/${img.name}`}
                alt={img.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src =
                    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBsb2FkIGVycm9yPC90ZXh0Pjwvc3ZnPg==";
                }}
              />
              <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                <button
                  onClick={() => handleCopyUrl(img.name)}
                  className="opacity-0 group-hover:opacity-100 bg-white text-gray-800 px-4 py-2 rounded-md flex items-center gap-2 hover:bg-gray-100 transition-all duration-300"
                >
                  <CopyOutlined />
                  复制链接
                </button>
              </div>
            </div>
            <div className="p-3">
              <p className="text-sm text-gray-600 truncate">{img.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UploadPage;
