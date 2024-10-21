import { useNavigate } from "react-router-dom";
import Form from "../Form";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { login, resetStatus } from "../../../store/authSlice";
import { UserLoginType } from "../types";
import { Status } from "../../../globals/types/types";
import { useEffect } from "react";

const Login = () => {
  const navigate = useNavigate();
  const { status } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const handleLogin = async (data: UserLoginType) => {
    dispatch(login(data));
  };
  useEffect(() => {
    if (status === Status.SUCCESS) {
      dispatch(resetStatus());
      navigate("/");
    }
  }, [status, navigate, dispatch]);
  return <Form type="login" onSubmit={handleLogin} />;
};

export default Login;
