
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ShopItem {
  name: string;
  price: string;
  image: string;
  category: string;
}

export const ShopSection = () => {
  const shopItems: ShopItem[] = [
    {
      name: "Stick Profissional",
      price: "129,99€",
      image: "/lovable-uploads/c36667ca-9257-4046-9d64-b47bc79a4ba3.png",
      category: "Sticks"
    },
    {
      name: "Bolas Oficiais (6 unid.)",
      price: "24,99€",
      image: "/lovable-uploads/b2a3a926-e3f0-469c-9390-0113bfb380ea.png",
      category: "Bolas"
    },
    {
      name: "Equipamento Proteção",
      price: "79,99€",
      image: "/lovable-uploads/57e06117-8822-4287-8b8c-e947952330c8.png",
      category: "Proteção"
    },
    {
      name: "Luvas Profissionais",
      price: "45,99€", 
      image: "/lovable-uploads/18941c1a-b681-46a8-b651-0e812f6192b0.png",
      category: "Proteção"
    }
  ];

  return (
    <section id="shop" className="py-16 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">Loja</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {shopItems.map((item, index) => (
            <Card 
              key={`${item.name}-${index}`} 
              className="overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute top-2 right-2 bg-primary text-black font-semibold px-2 py-1 rounded-md text-sm">
                  {item.category}
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg">{item.name}</h3>
                <p className="text-primary font-bold text-xl mt-2">{item.price}</p>
                <Button className="mt-4 w-full flex items-center justify-center bg-secondary text-white py-2 rounded-md hover:bg-secondary/90 transition-colors">
                  Comprar na secção do clube
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
