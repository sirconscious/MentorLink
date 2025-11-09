import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import { usePage } from "@inertiajs/react"
import FlashMessage from "@/components/FlashMessage"
import { AlertDialogDemo } from "@/components/AlertDialogDemo"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import DashboardLayout from "./Layouts/DashboardLayout"
import data from "./data.json"
import { AlertCircle, Github } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Page() {
  const { flash } = usePage().props;
  console.log(usePage().props);
  const role = usePage().props.auth.roles[0];

  return (
    <DashboardLayout>
      {
        role == "mentor" ?
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <SectionCards />
                <div className="px-4 lg:px-6">
                  <ChartAreaInteractive />
                </div>
                <DataTable data={data} />
              </div>
            </div>
          </div> :
          <div className="flex flex-1 items-center justify-center p-4">
            <Card className="w-full max-w-md">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="rounded-full bg-muted p-3">
                    <AlertCircle className="h-6 w-6 text-muted-foreground" />
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-2xl font-semibold">Not a Mentor Yet</h2>
                    <p className="text-muted-foreground text-sm">
                      You need to meet the mentor requirements to access this dashboard.
                    </p>
                  </div>

                  <div className="w-full pt-2 space-y-3">
                 
                    <AlertDialogDemo/>
                  
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
      }
    </DashboardLayout>
  );
}