import { setError, setLoading, setUser } from "../state/auth.slice";
import { register, login, getMe, logout } from "../services/auth.api";
import { useDispatch } from "react-redux";
import { setItems, setSubtotal } from "@/features/cart/state/cart.slice";
import toast from "react-hot-toast";

export const useAuth = () => {
  const dispatch = useDispatch();

  async function handleRegister({
    email,
    contact,
    password,
    fullname,
    isSeller = false,
  }) {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const data = await register({ email, contact, password, fullname, isSeller });

      dispatch(setUser(data.user));
      return data.user;
    } catch (error) {
      dispatch(setError(error?.response?.data?.message || error.message));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleLogin({ email, password }) {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const data = await login({ email, password });

      dispatch(setUser(data.user));
      return data.user;
    } catch (error) {
      dispatch(setError(error?.response?.data?.message || error.message));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleGetMe() {
    try {
      dispatch(setLoading(true));

      const data = await getMe();

      dispatch(setUser(data.user));
      return data.user;
    } catch {
      // 401 or network error — treat as logged-out, not a crash
      dispatch(setUser(null));
    } finally {
      dispatch(setLoading(false));
    }
  }

  /**
   * Logs the user out and cleans up all local state.
   *
   * `navigate` is accepted as a parameter instead of calling useNavigate()
   * inside this hook. Hooks that call useNavigate() must themselves be rendered
   * inside the Router tree — but useAuth is sometimes used in App.jsx which
   * wraps the Router, causing "useNavigate() may only be used in a <Router>"
   * errors. Passing navigate from the component avoids this entirely.
   *
   * @param {Function} navigate - the navigate fn from the calling component's useNavigate()
   */
  async function handleLogout(navigate) {
    try {
      await logout();
    } catch {
      // Best-effort: even if the server request fails, clean up locally
    } finally {
      dispatch(setUser(null));
      dispatch(setItems([]));
      dispatch(setSubtotal(0));
      localStorage.removeItem("user");
      toast.success("Logged out successfully");
      navigate("/");
    }
  }

  return { handleRegister, handleLogin, handleGetMe, handleLogout };
};
