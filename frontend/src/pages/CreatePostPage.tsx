import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useCreatePost } from '../hooks/usePosts';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { validateContent, CONTENT_POLICY_SUMMARY } from '../content/policy';
import { toast } from 'sonner';

export default function CreatePostPage() {
  const navigate = useNavigate();
  const { identity, login } = useInternetIdentity();
  const createPost = useCreatePost();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [externalLink, setExternalLink] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const isAuthenticated = identity && !identity.getPrincipal().isAnonymous();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!isAuthenticated) {
      login();
      return;
    }

    if (!title.trim() || !description.trim()) {
      setValidationError('Title and description are required.');
      return;
    }

    // Client-side validation
    const titleValidation = validateContent(title);
    if (!titleValidation.valid) {
      setValidationError(titleValidation.error!);
      return;
    }

    const descriptionValidation = validateContent(description);
    if (!descriptionValidation.valid) {
      setValidationError(descriptionValidation.error!);
      return;
    }

    try {
      await createPost.mutateAsync({
        title: title.trim(),
        description: description.trim(),
        externalLink: externalLink.trim() || undefined,
      });
      
      toast.success('Post created successfully!');
      navigate({ to: '/' });
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to create post';
      if (errorMessage.includes('policy') || errorMessage.includes('keyword')) {
        setValidationError('Your content contains prohibited terms. Please review our content policy and ensure your post is appropriate for this platform.');
      } else {
        setValidationError(errorMessage);
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto max-w-2xl py-8 px-4">
        <Button variant="ghost" onClick={() => navigate({ to: '/' })} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Feed
        </Button>
        <Card>
          <CardHeader>
            <CardTitle>Sign In Required</CardTitle>
            <CardDescription>You must be signed in to create posts</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={login} className="w-full">
              Sign In with Internet Identity
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl py-8 px-4">
      <Button variant="ghost" onClick={() => navigate({ to: '/' })} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Feed
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create New Post</CardTitle>
          <CardDescription>Share content with the community</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs leading-relaxed">
              {CONTENT_POLICY_SUMMARY}
            </AlertDescription>
          </Alert>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Enter a descriptive title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={200}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe your content in detail"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={8}
                maxLength={2000}
                required
              />
              <p className="text-xs text-muted-foreground">
                {description.length}/2000 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="externalLink">External Link (Optional)</Label>
              <Input
                id="externalLink"
                type="url"
                placeholder="https://example.com"
                value={externalLink}
                onChange={(e) => setExternalLink(e.target.value)}
              />
            </div>

            {validationError && (
              <Alert variant="destructive">
                <AlertDescription>{validationError}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate({ to: '/' })}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createPost.isPending}
                className="flex-1"
              >
                {createPost.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Post'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
