import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";
import { FileSpreadsheet, Plus, Sparkles, Upload, Clock } from "lucide-react";
import logoImage from "../assets/14bd33c00fb18a1e46e6fbec8038e908490efbfd.png";


interface DashboardProps {
  userName: string;
  onNewSheet: () => void;
  onLoadTemplates: () => void;
  onShowAdvanced?: () => void;
  recentSheets?: Array<{ name: string; lastModified: string }>;
}

export function Dashboard({ userName, onNewSheet, onLoadTemplates, onShowAdvanced, recentSheets = [] }: DashboardProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="mb-12">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="inline-block mb-6"
          >
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-2xl bg-card p-2">
              <img src={logoImage} alt="EtherX Excel" className="w-full h-full object-contain" />
            </div>
          </motion.div>
          <h1 className="text-4xl mb-2">Welcome back, {userName}!</h1>
          <p className="text-muted-foreground text-xl">
            What would you like to work on today?
          </p>
        </div>

  {/* Quick Actions */}
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="cursor-pointer hover:shadow-lg transition-all hover:scale-105 border-2 hover:border-blue-500">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                  <Plus className="w-6 h-6 text-blue-500" />
                </div>
                <CardTitle>Blank Spreadsheet</CardTitle>
                <CardDescription>Start with an empty spreadsheet</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={onNewSheet} className="w-full">
                  Create New
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="cursor-pointer hover:shadow-lg transition-all hover:scale-105 border-2 hover:border-purple-500">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-purple-500" />
                </div>
                <CardTitle>Use Templates</CardTitle>
                <CardDescription>Budget, study, workout & more</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={onLoadTemplates} variant="outline" className="w-full">
                  Browse Templates
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="cursor-pointer hover:shadow-lg transition-all hover:scale-105 border-2 hover:border-green-500">
              <CardHeader>
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-4">
                  <Upload className="w-6 h-6 text-green-500" />
                </div>
                <CardTitle>Import File</CardTitle>
                <CardDescription>Upload CSV or JSON file</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" disabled>
                  Coming Soon
                </Button>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="cursor-pointer hover:shadow-lg transition-all hover:scale-105 border-2 hover:border-yellow-500">
              <CardHeader>
                <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-yellow-500" />
                </div>
                <CardTitle>Advanced Features</CardTitle>
                <CardDescription>Analytics, Achievements, Activity Log, More</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" onClick={onShowAdvanced}>
                  Explore Advanced
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent Sheets */}
        {recentSheets.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl mb-6 flex items-center gap-2">
              <Clock className="w-6 h-6" />
              Recent Sheets
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentSheets.map((sheet, index) => (
                <Card key={index} className="cursor-pointer hover:shadow-lg transition-all">
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <FileSpreadsheet className="w-5 h-5 text-blue-500 mt-1" />
                      <div className="flex-1">
                        <CardTitle className="text-base">{sheet.name}</CardTitle>
                        <CardDescription className="text-sm">
                          {sheet.lastModified}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16"
        >
          <h2 className="text-2xl mb-6">Features</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "Advanced Formulas",
              "Conditional Formatting",
              "Charts & Graphs",
              "Export/Import",
              "Auto-Save",
              "Keyboard Shortcuts",
              "Find & Replace",
              "Multiple Sheets",
            ].map((feature, index) => (
              <div
                key={index}
                className="p-4 bg-card border border-border rounded-lg text-center"
              >
                <p className="text-sm">{feature}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
