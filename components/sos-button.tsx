"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Phone, MapPin, X, Shield, Users, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

export function SOSButton() {
  const [isPressed, setIsPressed] = useState(false)
  const [showSOSPanel, setShowSOSPanel] = useState(false)
  const [countdown, setCountdown] = useState(0)

  const handleSOSPress = () => {
    setShowSOSPanel(true)
  }

  const handleEmergencyCall = (type: string) => {
    setIsPressed(true)
    setShowSOSPanel(false)

    // Simulate emergency action
    alert(
      `${type} Alert Sent! Emergency services and your emergency contacts have been notified. Your location has been shared.`,
    )

    setTimeout(() => setIsPressed(false), 3000)
  }

  const handleQuickSOS = () => {
    setCountdown(5)
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          handleEmergencyCall("EMERGENCY SOS")
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const cancelCountdown = () => {
    setCountdown(0)
  }

  return (
    <>
      {/* SOS Button */}
      <Button
        onClick={handleSOSPress}
        className={cn(
          "fixed bottom-20 right-4 z-50 w-14 h-14 rounded-full shadow-lg",
          "bg-destructive hover:bg-destructive/90 text-destructive-foreground",
          "transition-all duration-200 hover:scale-110",
          isPressed && "animate-pulse bg-destructive/80",
        )}
        size="icon"
      >
        {isPressed ? <Phone className="h-6 w-6" /> : <AlertTriangle className="h-6 w-6" />}
      </Button>

      {/* Countdown Overlay */}
      {countdown > 0 && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center">
          <Card className="w-80 mx-4">
            <CardContent className="p-6 text-center">
              <div className="text-6xl font-bold text-destructive mb-4">{countdown}</div>
              <p className="text-lg mb-4">Emergency SOS will be sent in</p>
              <Button onClick={cancelCountdown} variant="outline" className="w-full bg-transparent">
                Cancel Emergency Call
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* SOS Panel */}
      {showSOSPanel && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <Shield className="h-5 w-5" />
                  Emergency Safety
                </CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setShowSOSPanel(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Quick Emergency SOS */}
              <Button
                onClick={handleQuickSOS}
                className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground h-12"
              >
                <AlertTriangle className="h-5 w-5 mr-2" />
                Emergency SOS (5s countdown)
              </Button>

              {/* Emergency Services */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground">Emergency Services</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Button onClick={() => handleEmergencyCall("Police")} variant="outline" className="h-10">
                    <Phone className="h-4 w-4 mr-2" />
                    Police
                  </Button>
                  <Button onClick={() => handleEmergencyCall("Medical")} variant="outline" className="h-10">
                    <Phone className="h-4 w-4 mr-2" />
                    Medical
                  </Button>
                </div>
              </div>

              {/* Safety Features */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground">Safety Features</h4>
                <div className="space-y-2">
                  <Button
                    onClick={() => alert("Location shared with emergency contacts")}
                    variant="outline"
                    className="w-full justify-start h-10"
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Share Live Location
                  </Button>
                  <Button
                    onClick={() => alert("Emergency contacts notified of your status")}
                    variant="outline"
                    className="w-full justify-start h-10"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Alert Emergency Contacts
                  </Button>
                  <Button
                    onClick={() => alert("Check-in timer started - we'll check on you in 30 minutes")}
                    variant="outline"
                    className="w-full justify-start h-10"
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Safety Check-in Timer
                  </Button>
                </div>
              </div>

              {/* Emergency Info */}
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-xs text-muted-foreground">
                  Your location will be automatically shared with emergency services and your emergency contacts when
                  SOS is activated.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
