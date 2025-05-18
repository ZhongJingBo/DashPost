import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getPostService,
  deletePostService,
  setPostStatusService,
} from "../service";
import NotePreview from "../components/NotePreview";
import { Button, message, Select } from "antd";
import { useNavigate } from "react-router-dom";
import NoteEditorCompont from "../components/NoteEditorCompont";
import { useList } from "../context/ListContext";
const Posts = () => {
  const { id } = useParams();
  const [posts, setPosts] = useState<any>(null);
  const [status, setStatus] = useState<string>("view");
  const { list, refreshList } = useList();
  const [postStatus, setPostStatus] = useState<string>("DRAFT");
  const navigate = useNavigate();

  useEffect(() => {
    initPosts();
  }, [id]);

  const initPosts = async () => {
    const res = await getPostService(id as string);
    setPosts(res.data.data);
    setPostStatus(res.data.data.status);
    setStatus("view");
  };

  const deletePost = async () => {
    const res = await deletePostService(id as string);
    if (res.data.message === "success") {
      message.success("删除成功");
      await refreshList();
      if (id === list[0].id) {
        navigate(`/posts/${list[1].id}`);
      } else {
        navigate(`/posts/${list[0].id}`);
      }
    } else {
      message.error("删除失败");
    }
  };

  const handleSetPostStatus = async (value: string) => {
    setPostStatus(value);
    const res = await setPostStatusService(id as string, value);
    if (res.data.message === "success") {
      message.success("设置成功");
    } else {
      message.error("设置失败");
    }
  };
  return (
    <div className="h-full min-h-[calc(100vh-64px)]">
      {status === "view" ? (
        <>
          <div className="flex justify-end  gap-2">
            {" "}
            <Button type="primary" danger onClick={deletePost}>
              删除
            </Button>
            <Button
              type="primary"
              onClick={() => {
                setStatus("edit");
              }}
            >
              编辑
            </Button>
            <Select value={postStatus} onChange={handleSetPostStatus}>
              <Select.Option value="PUBLISHED">发布</Select.Option>
              <Select.Option value="DRAFT">草稿</Select.Option>
            </Select>
          </div>

          <div className="text-2xl font-bold mb-4">{posts?.title}</div>
          <NotePreview>{posts?.content}</NotePreview>
        </>
      ) : (
        <NoteEditorCompont
          userId={id as string}
          content={posts?.content}
          title={posts?.title}
          setStatus={initPosts}
        />
      )}
    </div>
  );
};

export default Posts;
