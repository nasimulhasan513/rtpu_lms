import { useToast } from "@/components/ui/toast/use-toast";

export function useSetting(queryKey: string, initialValue = "") {
  const { data } = useFetch("/api/admin/settings", {
    method: "GET",
    query: {
      key: queryKey,
    },
  });

  const value = ref(data.value || initialValue);
  const { toast } = useToast();

  const saveData = async (key: string, value: any) => {
    await $fetch("/api/admin/settings", {
      method: "POST",
      body: {
        key,
        value,
      },
    });
    toast({
      title: `${key.charAt(0).toUpperCase() + key.slice(1)} has been updated.`,
    });
  };

  debouncedWatch(
    value,
    (newValue) => {
      saveData(queryKey, newValue);
    },
    { debounce: 500 }
  );

  return value;
}
