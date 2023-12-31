import { AddRestaurant } from "@/source/components/add";

export default async function Page() {
  return (
    <div>
      <h6>Add restaurant to rank</h6>
      <h6>
        First register on{" "}
        <a href="https://umenu.app" target="_blank" rel="noopener noreferrer" className="text-blue-500">
          u-menu.app
        </a>
      </h6>
      <h6>Then select and add your restaurant to the rank with ETH</h6>
      <AddRestaurant />
    </div>
  );
}
