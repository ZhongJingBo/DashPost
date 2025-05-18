import { useEffect, useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { Button, Dropdown, message, Modal } from "antd";
import type { MenuProps } from "antd";
import { getUserInfo, clearAuthData } from "../utils/auth";
import { useList } from "../context/ListContext";

interface UserInfo {
  username?: string;
}

export default function MainLayout() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const { list, refreshList } = useList();

  useEffect(() => {
    const info = getUserInfo();
    setUserInfo(info);
    refreshList();
  }, []);

  const handleLogout = () => {
    Modal.confirm({
      title: "确认退出",
      content: "确定要退出登录吗？",
      onOk: () => {
        clearAuthData();
        message.success("已退出登录");
        navigate("/login");
      },
    });
  };

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: <span onClick={() => navigate("/profile")}>个人信息</span>,
    },
    {
      key: "2",
      label: <span onClick={handleLogout}>退出登录</span>,
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* 侧边栏 */}
      <aside className="w-64 bg-gray-800 flex flex-col shadow-xl">
        {/* Logo区域 */}
        <div className=" h-16 flex items-center  border-b border-gray-700 px-4  ">
          <div className="text-xl font-bold text-white mb-0">DashPost</div>
          <div className="ml-5">
            <Button onClick={() => navigate("/note-editor")} type="primary">
              New
          </Button>
          </div>
        </div>

        {/* 导航菜单 */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-1 px-2">
            {list &&
              list.map((item) => (
                <li key={item.id}>
                  <NavLink
                    to={"/posts/" + item.id}
                    className={({ isActive }) =>
                      `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                          : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                      }`
                    }
                  >
                    <span className="truncate">{item.title}</span>
                  </NavLink>
                </li>
              ))}
          </ul>
        </nav>

        {/* 用户信息区域 */}
        <div className="p-4 border-t border-gray-700">
          <Dropdown menu={{ items }} placement="topRight">
            <Button type="text" className="w-full text-left justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">
                    {userInfo?.username?.[0]?.toUpperCase() || "?"}
                  </span>
                </div>
                <div className="flex-1 min-w-0 items-center justify-between">
                  <div className="text-sm font-medium text-white truncate">
                    {userInfo?.username || "未知用户"}
                  </div>
                </div>
              </div>
            </Button>
          </Dropdown>
        </div>
      </aside>

      {/* 主内容区域 */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
        <div className="container mx-auto px-6 py-8 bg-white">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
