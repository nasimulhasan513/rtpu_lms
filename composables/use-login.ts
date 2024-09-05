import { LoginSchema } from "~/schema/login.schema";

const state = reactive({
  isOpen: false,
});

export default function useLogin() {
  const { isOpen } = toRefs(state);

  const onOpen = () => {
    state.isOpen = true;
  };

  const onClose = () => {
    state.isOpen = false;
  };

  return {
    isOpen,
    onOpen,
    onClose,
    LoginSchema,
  };
}
