import { Form, Input, Button, Card, message } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../service";
interface RegisterForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register = () => {
  const navigate = useNavigate();

  const onFinish = (values: RegisterForm) => {
    // 这里添加实际的注册逻辑
    if (values.password !== values.confirmPassword) {
      message.error("两次输入的密码不一致！");
      return;
    }

    register("user/register", {
      method: "POST",
      body: JSON.stringify(values),
    }).then((res) => {
      console.log(res);
        message.success("注册成功！");
        navigate("/login");
      })
      .catch((err) => {
        console.log(err);
        message.error("注册失败！");
      });
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-100">
      <div className="w-[500px] max-w-full px-4 mx-auto">
        <Card variant="outlined" className="w-full shadow-xl rounded-lg">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-800">创建新账号</h1>
            <p className="text-slate-500 mt-2">请填写以下信息完成注册</p>
          </div>

          <Form
            name="register"
            onFinish={onFinish}
            size="large"
            layout="vertical"
            className="max-w-full"
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: "请输入用户名！" },
                { min: 3, message: "用户名至少3个字符！" },
              ]}
            >
              <Input
                prefix={<UserOutlined className="text-slate-400" />}
                placeholder="用户名"
                className="h-12 text-base"
              />
            </Form.Item>

            <Form.Item
              name="email"
              rules={[
                { required: true, message: "请输入邮箱！" },
                { type: "email", message: "请输入有效的邮箱地址！" },
              ]}
            >
              <Input
                prefix={<MailOutlined className="text-slate-400" />}
                placeholder="邮箱"
                className="h-12 text-base"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: "请输入密码！" },
                { min: 6, message: "密码至少6个字符！" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-slate-400" />}
                placeholder="密码"
                className="h-12 text-base"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              rules={[
                { required: true, message: "请确认密码！" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("两次输入的密码不一致！"));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-slate-400" />}
                placeholder="确认密码"
                className="h-12 text-base"
              />
            </Form.Item>

            <Form.Item className="mb-2">
              <Button
                type="primary"
                htmlType="submit"
                className="w-full h-12 text-base font-medium"
              >
                注册
              </Button>
            </Form.Item>

            <div className="text-center text-slate-500">
              已有账号？{" "}
              <Link to="/login" className="text-blue-500 hover:text-blue-600">
                立即登录
              </Link>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Register;
