import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NotePreview from "./NotePreview";
import { Input, Card, Button, message, Upload } from "antd";
import { createPostService, updatePostService } from "../service";
import { useList } from "../context/ListContext";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { baseUrl } from "../service";
import "./noteeditorCompont.css";
const { TextArea } = Input;

export default function NoteEditor({
  userId,
  content: initContent,
  title: initTitle,
  setStatus,  
}: {
  userId?: string;
  content?: string;
  title?: string;
  setStatus?: () => void;
}) {
  const [title, setTitle] = useState(initTitle || "");
  const [body, setBody] = useState(initContent || "");
  const navigate = useNavigate();
  const { refreshList } = useList();

  const createNote = async () => {
    try {
      const res = await createPostService({
        title,
        content: body,
      });
      console.log(res);
      if (res.data.message === "success") {
        await refreshList(); // 刷新列表
        message.success("创建成功");
        navigate(`/posts/${res.data.data.id}`);
      } else {
        message.error("创建失败");
      }
    } catch (error) {
      console.error("Failed to create note:", error);
      message.error("创建失败");
    }
  };

  const updateNote = async () => {
    const res = await updatePostService(userId as string, {
      title,
      content: body,
    });
    if (res.data.message === "success") {
      message.success("修改成功");
      setStatus && setStatus();
      navigate(`/posts/${userId}`);
    } else {
      message.error("修改失败");
    }
  };

  // 限制用户只能上传md文件
  const uploadProps: UploadProps = {
    name: "file",
    action: `${baseUrl}post/uploadNote`,
    headers: {
      authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
    accept: ".md, .markdown", // 在上传前处理文件
    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        // 解码文件名后显示
        const decodedFileName = decodeURIComponent(info.file.name);
        message.success(`${decodedFileName} 上传成功`);
      } else if (info.file.status === "error") {
        // 解码文件名后显示
        const decodedFileName = decodeURIComponent(info.file.name);
        message.error(`${decodedFileName} 上传失败`);
      }
    },
  };

  return (
    <div className="h-full min-h-[calc(100vh-64px)]">
      <div className="flex h-full w-full min-h-[calc(100vh-64px)]">
        {/* 编辑区域 */}
        <Card
          className="w-1/2 shadow-lg rounded-none"
          style={{ height: "calc(100vh-200px)" }}
        >
          <div className="h-full flex flex-col">
            <div className="flex justify-end mb-4">
              {userId ? (
                <Button type="primary" onClick={updateNote}>
                  修改文章
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Upload {...uploadProps}>
                    <Button icon={<UploadOutlined />}>
                      上传 Markdown 文件
                    </Button>
                  </Upload>
                  <Button type="primary" onClick={createNote}>
                    创建文章
                  </Button>
                </div>
              )}
            </div>

            <div className="flex-1 flex flex-col h-[calc(100vh-200px)]">
              <div className="mb-2">文章标题</div>
              <Input
                id="note-title-input"
                type="text"
                value={title}
                placeholder="请输入文章标题"
                className="text-lg mb-4"
                onChange={(e) => setTitle(e.target.value)}
              />
              <div className="mb-2">文章内容</div>
              <TextArea
                value={body}
                id="note-body-input"
                placeholder="请输入文章内容（支持 Markdown 格式）"
                className="flex-1 resize-none h-full"
                onChange={(e) => setBody(e.target.value)}
              />
            </div>
          </div>
        </Card>

        {/* 预览区域 */}
        <Card
          className="w-1/2 shadow-lg rounded-none"
          style={{ height: "calc(100vh-200px)" }}
        >
          <div className="h-full flex flex-col">
            <div className="border-b pb-2 mb-4 flex-shrink-0">
              <h2 className="text-lg font-medium text-gray-900">预览</h2>
            </div>
            <div className="prose max-w-none flex-1 overflow-auto">
              <h1 className="text-2xl font-bold mb-4">
                {title || "未命名文章"}
              </h1>
              <NotePreview>{body || "开始编写你的文章..."}</NotePreview>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
