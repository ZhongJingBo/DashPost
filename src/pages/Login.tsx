import { Form, Input, Button, Card, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate, useLocation, Link, Navigate } from "react-router-dom";
import { loginService, LoginParams } from "../service";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || "/dashboard";

  // 检查是否已登录
  const token = localStorage.getItem("access_token");
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  const onFinish = async (values: LoginParams) => {
    try {
      const response = await loginService(values);
      const { data, status } = response;
        console.log(data);
      if (status === 200 || status === 201) {
        // 保存token和用户信息
        localStorage.setItem('access_token', data.data.accessToken);
        localStorage.setItem('refresh_token', data.data.refreshToken); 
        localStorage.setItem('user_info', JSON.stringify(data.data.userInfo));
        
        message.success('登录成功');
        navigate(from, { replace: true });
      } 
    } catch (error: any) {
      if (error.response) {
        message.error(error.response.data.message || '登录失败');
      } else {
        message.error('网络错误，请稍后重试');
      }
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-100">
      <div className="w-[500px] max-w-full px-4 mx-auto">
        <Card variant="outlined" className="w-full shadow-xl rounded-lg">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-800">博客管理系统</h1>
            <p className="text-slate-500 mt-2">请登录您的账号</p>
          </div>

          <Form
            name="login"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            size="large"
            layout="vertical"
            className="max-w-full"
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: "请输入用户名！" }]}
            >
              <Input
                prefix={<UserOutlined className="text-slate-400" />}
                placeholder="用户名"
                className="h-12 text-base"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: "请输入密码！" }]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-slate-400" />}
                placeholder="密码"
                className="h-12 text-base"
              />
            </Form.Item>

            <Form.Item className="mb-2">
              <Button
                type="primary"
                htmlType="submit"
                className="w-full h-12 text-base font-medium"
              >
                登录
              </Button>
            </Form.Item>

            <div className="text-center text-slate-500">
              还没有账号？{" "}
              <Link to="/register" className="text-blue-500 hover:text-blue-600">
                立即注册
              </Link>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
