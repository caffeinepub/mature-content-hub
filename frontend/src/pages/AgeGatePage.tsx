import { useState } from 'react';
import { useAgeGate } from '../hooks/useAgeGate';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ShieldAlert, CheckCircle2 } from 'lucide-react';
import { AGE_GATE_DISCLAIMER, CONTENT_POLICY_SUMMARY } from '../content/policy';

export default function AgeGatePage() {
  const { confirm } = useAgeGate();
  const [agreed, setAgreed] = useState(false);
  const [declined, setDeclined] = useState(false);

  const handleConfirm = () => {
    if (agreed) {
      confirm();
    }
  };

  const handleDecline = () => {
    setDeclined(true);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background p-4">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <ShieldAlert className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold">Age Verification Required</CardTitle>
          <CardDescription className="text-base">
            This platform contains mature content intended for adults only
          </CardDescription>
        </CardHeader>
        
        <Separator />
        
        <CardContent className="space-y-6 pt-6">
          <Alert>
            <AlertDescription className="text-sm leading-relaxed">
              {AGE_GATE_DISCLAIMER}
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Content Policy</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {CONTENT_POLICY_SUMMARY}
            </p>
          </div>

          {declined && (
            <Alert variant="destructive">
              <AlertDescription>
                You must be 18 or older to access this platform. If you are under 18, please exit now.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex items-start space-x-3 rounded-lg border p-4">
            <Checkbox
              id="age-confirm"
              checked={agreed}
              onCheckedChange={(checked) => setAgreed(checked === true)}
              className="mt-0.5"
            />
            <label
              htmlFor="age-confirm"
              className="text-sm leading-relaxed cursor-pointer select-none"
            >
              I confirm that I am 18 years of age or older, and I agree to comply with the platform's content policy and terms of service.
            </label>
          </div>
        </CardContent>

        <CardFooter className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleDecline}
          >
            I'm Under 18
          </Button>
          <Button
            className="flex-1"
            onClick={handleConfirm}
            disabled={!agreed}
          >
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Confirm & Enter
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
