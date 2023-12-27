import React, { ReactNode, ReactElement, FunctionComponent } from "react";
import { HiX } from "react-icons/hi";

interface TabProps {
  label: string;
  hideLabel?: boolean;
  canCloseTabFunction?: Function;
  tabId: number;
  icon?: FunctionComponent;
  children: ReactNode;
}

const Tab: React.FC<TabProps> = ({ children }) => <>{children}</>;

interface TabsProps {
  children: ReactNode;
  activeTab: number;
  setActiveTab: Function;
}

const Tabs: React.FC<TabsProps> = ({ children, activeTab, setActiveTab }) => {
  // Filter out non-ReactElement children and cast to ReactElement<TabProps>[]
  const validChildren = React.Children.toArray(children).filter(
    (child): child is ReactElement<TabProps> => React.isValidElement(child)
  ) as ReactElement<TabProps>[];

  return (
    <div>
      {/* Tab Buttons */}
      <div className="flex border-b" style={{ minHeight: "30px" }}>
        {validChildren.map((child, index) => (
          <div
            key={child.props.tabId}
            className={`border-1 border-r cursor-pointer min-h-5 flex align-middle px-4 py-1 text-sm font-medium text-gray-700 hover:bg-gray-200 ${
              activeTab === child.props.tabId ? "bg-gray-200 shadow" : ""
            }`}
          >
            <span
              className="flex items-center"
              onClick={() => setActiveTab(child.props.tabId)}
            >
              {child.props.icon && React.createElement(child.props.icon)}
              {!child.props.hideLabel && child.props.label}
            </span>
            {child.props.canCloseTabFunction && (
              <button
                onClick={() =>
                  child.props.canCloseTabFunction(child.props.tabId)
                }
                className="hover:bg-gray-400 rounded-sm ml-2"
              >
                <HiX />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {validChildren.map((child) => {
          if (child.props.tabId !== activeTab) return null;
          return React.cloneElement(child, { ...child.props });
        })}
      </div>
    </div>
  );
};

export { Tabs, Tab };
