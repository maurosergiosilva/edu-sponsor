import { BADGES, COURSES, SPONSOR_LEVELS } from "@/helpers/constant";
import { create } from "zustand";

export type Course = {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  duration: string;
};

export type Sponsorship = {
  id: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseTitle: string;
  amount: number;
  date: string;
};

export type UserData = {
  id: string;
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  userType: "student" | "sponsor";
  age?: string;
  interests?: string[];
  sponsoredCourses?: Sponsorship[];
  sponsorType?: "PF" | "PJ";
  document?: string;
  companyName?: string;
  representativeName?: string;
  balance?: number;
  sponsorships?: Sponsorship[];
  sponsorLevel?: number;
  sponsorPoints?: number;
  badges?: string[];
  lastSponsorshipDate?: string;
};

type UserState = {
  currentUser: UserData | null;
  users: UserData[];
  courses: Course[];
  sponsorLevels: {
    level: number;
    name: string;
    pointsRequired: number;
    badge: string;
    benefits: string[];
  }[];
  sponsorLottery: {
    lastWinner: string | null;
    nextDraw: string;
    prizePool: number;
  };
  signUp: (userData: UserData) => void;
  signIn: (email: string, password: string) => UserData | undefined;
  signOut: () => void;
  updateUser: (userId: string, updates: Partial<UserData>) => void;
  addCourse: (course: Course) => void;
  addSponsorship: (sponsorship: Sponsorship) => void;
  addFunds: (userId: string, amount: number) => void;
  updateSponsorLevel: (userId: string) => void;
  addSponsorPoints: (userId: string, points: number) => void;
  enterSponsorLottery: (userId: string) => void;
  drawSponsorLottery: () => void;
  checkForNewBadges: (userId: string) => string[];
};

export const useUserStore = create<UserState>((set, get) => ({
  currentUser: null,
  users: [],
  courses: COURSES,
  sponsorLevels: SPONSOR_LEVELS,
  sponsorLottery: {
    lastWinner: null,
    nextDraw: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    prizePool: 0,
  },

  signUp: (userData) =>
    set((state) => ({
      users: [...state.users, userData],
      currentUser: userData,
    })),

  signIn: (email, password) => {
    const user = get().users.find(
      (user) => user.email === email && user.password === password
    );
    if (user) {
      set({ currentUser: user });
      return user;
    }
    return undefined;
  },

  signOut: () => set({ currentUser: null }),

  updateUser: (userId, updates) =>
    set((state) => ({
      users: state.users.map((user) =>
        user.id === userId ? { ...user, ...updates } : user
      ),
      currentUser:
        state.currentUser?.id === userId
          ? { ...state.currentUser, ...updates }
          : state.currentUser,
    })),

  addCourse: (course) =>
    set((state) => ({ courses: [...state.courses, course] })),

  addSponsorship: (sponsorship) => {
    const { studentId, amount } = sponsorship;
    const current = get().currentUser;

    set((state) => ({
      sponsorLottery: {
        ...state.sponsorLottery,
        prizePool: state.sponsorLottery.prizePool + amount * 0.01,
      },
    }));

    set((state) => {
      const updatedUsers = state.users.map((user) => {
        if (user.id === studentId) {
          return {
            ...user,
            sponsoredCourses: [...(user.sponsoredCourses || []), sponsorship],
          };
        }
        if (current && user.id === current.id && user.userType === "sponsor") {
          const updatedSponsorPoints =
            (user.sponsorPoints || 0) + Math.floor(amount / 10);

          return {
            ...user,
            balance: (user.balance || 0) - amount,
            sponsorships: [...(user.sponsorships || []), sponsorship],
            sponsorPoints: updatedSponsorPoints,
            lastSponsorshipDate: new Date().toISOString(),
          };
        }
        return user;
      });

      const updatedCurrentUser =
        current && current.id === studentId
          ? {
              ...current,
              sponsoredCourses: [
                ...(current.sponsoredCourses || []),
                sponsorship,
              ],
            }
          : current &&
            current.userType === "sponsor" &&
            current.id === current.id
          ? {
              ...current,
              balance: (current.balance || 0) - amount,
              sponsorships: [...(current.sponsorships || []), sponsorship],
              sponsorPoints:
                (current.sponsorPoints || 0) + Math.floor(amount / 10),
              lastSponsorshipDate: new Date().toISOString(),
            }
          : current;

      const newBadges = updatedCurrentUser
        ? BADGES.filter(
            (badge) =>
              !(updatedCurrentUser.badges || []).includes(badge.id) &&
              badge.condition(updatedCurrentUser)
          ).map((badge) => badge.id)
        : [];

      const finalUsers = updatedUsers.map((user) => {
        if (user.id === updatedCurrentUser?.id && newBadges.length > 0) {
          return {
            ...user,
            badges: [...(user.badges || []), ...newBadges],
          };
        }
        return user;
      });

      const finalCurrentUser =
        updatedCurrentUser && newBadges.length > 0
          ? {
              ...updatedCurrentUser,
              badges: [...(updatedCurrentUser.badges || []), ...newBadges],
            }
          : updatedCurrentUser;

      return {
        users: finalUsers,
        currentUser: finalCurrentUser,
      };
    });
  },

  addFunds: (userId, amount) =>
    set((state) => ({
      users: state.users.map((user) =>
        user.id === userId
          ? { ...user, balance: (user.balance || 0) + amount }
          : user
      ),
      currentUser:
        state.currentUser?.id === userId
          ? {
              ...state.currentUser,
              balance: (state.currentUser?.balance || 0) + amount,
            }
          : state.currentUser,
    })),

  addSponsorPoints: (userId, points) =>
    set((state) => ({
      users: state.users.map((user) =>
        user.id === userId && user.userType === "sponsor"
          ? {
              ...user,
              sponsorPoints: (user.sponsorPoints || 0) + points,
              lastSponsorshipDate: new Date().toISOString(),
            }
          : user
      ),
      currentUser:
        state.currentUser?.id === userId &&
        state.currentUser.userType === "sponsor"
          ? {
              ...state.currentUser,
              sponsorPoints: (state.currentUser.sponsorPoints || 0) + points,
              lastSponsorshipDate: new Date().toISOString(),
            }
          : state.currentUser,
    })),

  updateSponsorLevel: (userId) =>
    set((state) => {
      const user = state.users.find((user) => user.id === userId);
      if (!user || user.userType !== "sponsor") return state;

      const currentPoints = user.sponsorPoints || 0;
      const newLevel = state.sponsorLevels
        .filter((level) => level.pointsRequired <= currentPoints)
        .reduce((max, level) => Math.max(max, level.level), 0);

      if (newLevel === (user.sponsorLevel || 0)) return state;

      return {
        users: state.users.map((user) =>
          user.id === userId ? { ...user, sponsorLevel: newLevel } : user
        ),
        currentUser:
          state.currentUser?.id === userId
            ? { ...state.currentUser, sponsorLevel: newLevel }
            : state.currentUser,
      };
    }),

  enterSponsorLottery: (userId) => {
    const user = get().users.find((user) => user.id === userId);
    if (!user || user.userType !== "sponsor" || (user.sponsorPoints || 0) < 50)
      return;

    set((state) => ({
      users: state.users.map((user) =>
        user.id === userId
          ? { ...user, sponsorPoints: (user.sponsorPoints || 0) - 50 }
          : user
      ),
      currentUser:
        state.currentUser?.id === userId
          ? {
              ...state.currentUser,
              sponsorPoints: (state.currentUser.sponsorPoints || 0) - 50,
            }
          : state.currentUser,
    }));
  },

  drawSponsorLottery: () => {
    const state = get();
    const sponsorUsers = state.users.filter(
      (user) => user.userType === "sponsor"
    );
    if (sponsorUsers.length === 0) return;

    const eligibleUsers = sponsorUsers.filter(
      (user) => user.sponsorPoints !== undefined && user.sponsorPoints >= 50
    );

    if (eligibleUsers.length === 0) return;

    const winnerIndex = Math.floor(Math.random() * eligibleUsers.length);
    const winner = eligibleUsers[winnerIndex];
    const prizeAmount = state.sponsorLottery.prizePool;

    set({
      sponsorLottery: {
        lastWinner: winner.id,
        nextDraw: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        prizePool: 0,
      },
    });

    get().addFunds(winner.id, prizeAmount);
  },

  checkForNewBadges: (userId) => {
    const user = get().users.find((user) => user.id === userId);
    if (!user) return [];

    const currentBadges = user.badges || [];
    const newBadges = BADGES.filter(
      (badge) => !currentBadges.includes(badge.id) && badge.condition(user)
    ).map((badge) => badge.id);

    if (newBadges.length > 0) {
      set((state) => ({
        users: state.users.map((user) =>
          user.id === userId
            ? { ...user, badges: [...currentBadges, ...newBadges] }
            : user
        ),
        currentUser:
          state.currentUser?.id === userId
            ? { ...state.currentUser, badges: [...currentBadges, ...newBadges] }
            : state.currentUser,
      }));
      return newBadges;
    }
    return [];
  },
}));
