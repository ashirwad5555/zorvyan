import { useEffect, useMemo, useReducer } from "react";
import { seedTransactions } from "../data/seedTransactions";
import { DashboardContext } from "./dashboardContextValue";

const STORAGE_KEY = "zorvyan-finance-dashboard-state";
const defaultState = {
  role: "user",
  theme: "light",
  transactions: seedTransactions,
  filters: {
    search: "",
    type: "all",
    category: "all",
    sort: "date-desc",
  },
};

function dashboardReducer(state, action) {
  switch (action.type) {
    case "SET_ROLE":
      return { ...state, role: action.payload };
    case "SET_THEME":
      return { ...state, theme: action.payload };
    case "UPDATE_FILTER":
      return {
        ...state,
        filters: {
          ...state.filters,
          [action.payload.key]: action.payload.value,
        },
      };
    case "ADD_TRANSACTION": {
      const nextId =
        Math.max(...state.transactions.map((item) => item.id), 0) + 1;
      return {
        ...state,
        transactions: [
          { id: nextId, ...action.payload },
          ...state.transactions,
        ],
      };
    }
    case "DELETE_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.filter(
          (item) => item.id !== action.payload,
        ),
      };
    default:
      return state;
  }
}

function getInitialState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return defaultState;
    }

    const parsed = JSON.parse(raw);
    if (!parsed?.transactions?.length) {
      return defaultState;
    }

    return {
      ...defaultState,
      ...parsed,
      theme: parsed.theme === "dark" ? "dark" : "light",
      filters: {
        ...defaultState.filters,
        ...(parsed.filters || {}),
      },
    };
  } catch {
    return defaultState;
  }
}

export function DashboardProvider({ children }) {
  const [state, dispatch] = useReducer(
    dashboardReducer,
    defaultState,
    getInitialState,
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", state.theme || "light");
  }, [state.theme]);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}
