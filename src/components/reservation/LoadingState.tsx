
import { Card, CardContent } from '@/components/ui/card';

export function LoadingState() {
  return (
    <div className="container max-w-4xl mx-auto py-12">
      <Card className="text-center">
        <CardContent className="pt-10">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-24 w-24 bg-slate-200 rounded-full mb-4"></div>
            <div className="h-8 w-64 bg-slate-200 rounded mb-2"></div>
            <div className="h-4 w-48 bg-slate-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
