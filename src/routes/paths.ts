export const paths = {
  page403: '/error/403',
  page404: '/error/404',
  page500: '/error/500',
  components: '/components',
  auth: {
    signIn: `/auth/sign-in`,
    signInPhone: `/auth/sign-in-phone`,
    signUp: `/auth/sign-up`,
  },
  dashboard: {
    root: '/',
    user: {
      root: `/user`,
      list: `/user/list`,
    },
    games: {
      wordBattle: {
        root: '/word-battle',
        list: '/word-battle/list',
        create: '/word-battle/create',
        edit: (id: string) => `/word-battle/${id}/edit`,
        view: `/word-battle/:id/view`,
        users: `/word-battle/players`,
        settings: `/word-battle/settings`,
      },
      flashCard: {
        root: '/flash-card',
        list: '/flash-card/list',
        create: '/flash-card/create',
        categoryList: '/flash-card/category-list',
        edit: (id: string) => `/flash-card/${id}/edit`,
      },
      picsWord: {
        root: '/pics-word',
        create: '/pics-word/create',
        update: (id: string) => `/pics-word/${id}/update`,
        list: '/pics-word/list',
        settings: '/pics-word/settings',
      },
      oddOneOut: {
        root: '/odd-one-out',
        list: '/odd-one-out/list',
        create: '/odd-one-out/create',
        edit: (id: string) => `/odd-one-out/${id}/update`,
      },
    },
  },
};
