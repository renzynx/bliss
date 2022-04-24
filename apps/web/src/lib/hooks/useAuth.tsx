import { useMeQuery } from '#lib/redux/slices/auth.slice';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAppDispatch } from '#lib/redux/hooks';
import { setIsAuth, setUser } from '#lib/redux/slices/user.slice';

export const useAuth = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { data, isLoading, isError } = useMeQuery();

  useEffect(() => {
    if (!isLoading && isError) {
      router.push('/');
    } else if (!isLoading && data) {
      dispatch(setUser(data.user));
      dispatch(setIsAuth(true));
    }
  }, [data, dispatch, isError, isLoading, router]);

  return { data, isLoading };
};
