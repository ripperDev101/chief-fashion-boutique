import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Ruler } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import sizeChartImage from '@/assets/size-chart.png';
import sizeChartMenImage from '@/assets/size-chart-men.png';

export const SizeChartDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors">
          <Ruler className="h-4 w-4" />
          Size Chart
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-background">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display">Size Chart</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="ladies" className="mt-4">
          <TabsList className="w-full">
            <TabsTrigger value="ladies" className="flex-1">Ladies</TabsTrigger>
            <TabsTrigger value="men" className="flex-1">Men</TabsTrigger>
          </TabsList>
          <TabsContent value="ladies">
            <img
              src={sizeChartImage}
              alt="Ladies size chart showing measurements for chest, waist, hips and body length across sizes XS to 2XL in centimeters"
              className="w-full h-auto rounded-md"
            />
          </TabsContent>
          <TabsContent value="men">
            <img
              src={sizeChartMenImage}
              alt="Men size chart showing measurements for chest, waist, hips and body length across sizes XS to 3XL in centimeters"
              className="w-full h-auto rounded-md"
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
