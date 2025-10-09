// // import DashboardLayout from '@/components/dashboard';
// import Inventory from "@/components/Inventory";


// export default function InventoryPage() {
//   return (
  
//       <Inventory />
    
//   );
// }


// src/app/(lite)/inventory/page.tsx

// 1. Import your component. Make sure this path is correct.
import Inventory from "@/components/Inventory";

// 2. Define your page component. The name must be PascalCase (e.g., InventoryPage).
export default function InventoryPage() {
  
  // 3. The component must return JSX.
  return (
    <Inventory />
  );
}