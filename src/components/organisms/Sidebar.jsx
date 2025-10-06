import { useContext } from "react";
import { NavLink } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";
import { AuthContext } from "@/App";

const Sidebar = ({ isOpen, onClose }) => {
  const { logout } = useContext(AuthContext);
  const navItems = [
    { path: "/", icon: "LayoutDashboard", label: "Dashboard" },
    { path: "/transactions", icon: "Receipt", label: "Transactions" },
    { path: "/budgets", icon: "Target", label: "Budgets" },
    { path: "/goals", icon: "TrendingUp", label: "Savings Goals" },
    { path: "/reports", icon: "BarChart3", label: "Reports" },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 lg:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-md">
              <ApperIcon name="DollarSign" size={24} className="text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">Penny Wise</h2>
              <p className="text-xs text-gray-500">Finance Tracker</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200"
          >
            <ApperIcon name="X" size={20} />
          </button>
        </div>

<nav className="p-4 space-y-2 flex-1 flex flex-col">
          <div className="space-y-2 flex-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-primary-50 text-primary-700 font-medium"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <ApperIcon name={item.icon} size={20} />
                    <span>{item.label}</span>
                    {isActive && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-500" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
          <div className="pt-4 border-t border-gray-200">
            <Button
              variant="ghost"
              size="sm"
              fullWidth
              onClick={() => {
                logout();
                onClose();
              }}
              className="justify-start"
            >
              <ApperIcon name="LogOut" size={20} />
              <span>Logout</span>
            </Button>
          </div>
        </nav>
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 bg-white border-r border-gray-200 h-screen sticky top-0">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-md">
              <ApperIcon name="DollarSign" size={28} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Penny Wise</h2>
              <p className="text-xs text-gray-500">Finance Tracker</p>
            </div>
          </div>
        </div>

<nav className="p-4 space-y-2 flex-1 flex flex-col">
          <div className="space-y-2 flex-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-primary-50 text-primary-700 font-medium"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <ApperIcon name={item.icon} size={20} />
                    <span>{item.label}</span>
                    {isActive && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-500" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
          <div className="pt-4 border-t border-gray-200">
            <Button
              variant="ghost"
              size="sm"
              fullWidth
              onClick={logout}
              className="justify-start"
            >
              <ApperIcon name="LogOut" size={20} />
              <span>Logout</span>
            </Button>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;