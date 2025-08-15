'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { type Post, type SocialProfile, type MediaItem } from '@/lib/social-types';
import { Calendar as CalendarIcon, Image as ImageIcon, Video, Trash2, X, Hash, Link } from 'lucide-react';
import * as Icons from 'lucide-react';
import { format } from 'date-fns';

interface PostEditorProps {
  post: Post | null;
  profiles: SocialProfile[];
  onSave: (post: Omit<Post, 'id' | 'scheduledTime'> & { id?: string; scheduledTime: Date }) => void;
  onDelete: (postId: string) => void;
  onClose: () => void;
}

export function EnhancedPostEditor({ post, profiles, onSave, onDelete, onClose }: PostEditorProps) {
  const [caption, setCaption] = useState('');
  const [scheduledTime, setScheduledTime] = useState<Date | undefined>(new Date());
  const [selectedProfiles, setSelectedProfiles] = useState<string[]>([]);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [hashtagInput, setHashtagInput] = useState('');

  useEffect(() => {
    if (post) {
      setCaption(post.caption);
      setScheduledTime(post.scheduledTime ? new Date(post.scheduledTime) : new Date());
      setSelectedProfiles(post.profileIds);
      setMedia(post.media || []);
      setHashtags(post.hashtags || []);
    } else {
      setCaption('');
      setScheduledTime(new Date());
      setSelectedProfiles([]);
      setMedia([]);
      setHashtags([]);
    }
  }, [post]);

  const handleSave = () => {
    if (selectedProfiles.length === 0) {
        alert("Please select at least one profile to publish to.");
        return;
    }
    const newPostData = {
      id: post?.id,
      profileIds: selectedProfiles,
      caption,
      scheduledTime: scheduledTime || new Date(),
      status: 'scheduled' as const,
      media,
      hashtags,
    };
    onSave(newPostData);
  };
  
  const handleProfileSelect = (profileId: string) => {
      setSelectedProfiles(prev => 
        prev.includes(profileId) ? prev.filter(id => id !== profileId) : [...prev, profileId]
      );
  };

  const handleMediaUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const url = URL.createObjectURL(file);
      const newMediaItem: MediaItem = {
        type,
        url,
        file,
      };
      setMedia(prev => [...prev, newMediaItem]);
    });
  };

  const removeMedia = (index: number) => {
    setMedia(prev => prev.filter((_, i) => i !== index));
  };

  const addHashtag = () => {
    if (hashtagInput.trim() && !hashtags.includes(hashtagInput.trim())) {
      const tag = hashtagInput.trim().startsWith('#') ? hashtagInput.trim() : `#${hashtagInput.trim()}`;
      setHashtags(prev => [...prev, tag]);
      setHashtagInput('');
    }
  };

  const removeHashtag = (tag: string) => {
    setHashtags(prev => prev.filter(t => t !== tag));
  };

  const handleHashtagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      addHashtag();
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <DialogHeader>
              <DialogTitle>{post ? 'Edit Post' : 'Create New Post'}</DialogTitle>
            </DialogHeader>
            
            {/* Profile Selection */}
            <div className="space-y-2">
              <Label>Publish to</Label>
              {profiles.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profiles.map(profile => {
                    const PlatformIcon = Icons[profile.platformIcon as keyof typeof Icons] as React.ComponentType<{ className?: string }>;
                    return (
                      <div key={profile.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`profile-${profile.id}`} 
                          checked={selectedProfiles.includes(profile.id)}
                          onCheckedChange={() => handleProfileSelect(profile.id)}
                        />
                        <label htmlFor={`profile-${profile.id}`} className="text-sm font-medium leading-none flex items-center gap-2 cursor-pointer">
                          <PlatformIcon className="h-4 w-4"/> {profile.name}
                        </label>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-sm text-blue-600">No social profiles connected. Please connect one in Settings.</p>
              )}
            </div>

            {/* Caption */}
            <div className="space-y-2">
              <Label htmlFor="caption">Caption ({caption.length}/2200)</Label>
              <Textarea
                id="caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="min-h-[200px]"
                placeholder="What's on your mind?"
              />
            </div>

            {/* Media Upload Section */}
            <div className="space-y-3">
              <Label>Media</Label>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleMediaUpload(e, 'image')}
                  className="hidden"
                  id="image-upload"
                />
                <input
                  type="file"
                  accept="video/*"
                  multiple
                  onChange={(e) => handleMediaUpload(e, 'video')}
                  className="hidden"
                  id="video-upload"
                />
                <Button variant="outline" size="sm" onClick={() => document.getElementById('image-upload')?.click()}>
                  <ImageIcon className="h-4 w-4 mr-2"/>Add Images
                </Button>
                <Button variant="outline" size="sm" onClick={() => document.getElementById('video-upload')?.click()}>
                  <Video className="h-4 w-4 mr-2"/>Add Videos
                </Button>
              </div>
              
              {/* Media Preview */}
              {media.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {media.map((item, index) => (
                    <div key={index} className="relative group">
                      {item.type === 'image' ? (
                         <Image src={item.url} alt="Upload preview" width={128} height={128} className="w-full h-32 object-cover rounded-lg" />                      ) : (
                        <video src={item.url} className="w-full h-32 object-cover rounded-lg" />
                      )}
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeMedia(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                      <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                        {item.type}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Hashtags Section */}
            <div className="space-y-3">
              <Label>Hashtags</Label>
              <div className="flex items-center gap-2">
                <Input
                  value={hashtagInput}
                  onChange={(e) => setHashtagInput(e.target.value)}
                  onKeyDown={handleHashtagKeyPress}
                  placeholder="Add hashtag (without #)"
                  className="flex-1"
                />
                <Button variant="outline" size="sm" onClick={addHashtag}>
                  <Hash className="h-4 w-4 mr-2"/>Add
                </Button>
              </div>
              
              {/* Hashtag Display */}
              {hashtags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {hashtags.map((tag, index) => (
                    <span key={index} className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {tag}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 p-0 hover:bg-blue-200 rounded-full"
                        onClick={() => removeHashtag(tag)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Scheduling Sidebar */}
          <div className="bg-muted/50 p-4 rounded-lg space-y-4">
            <h3 className="font-semibold">Scheduling</h3>
            <div className="space-y-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {scheduledTime ? format(scheduledTime, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={scheduledTime} onSelect={setScheduledTime} initialFocus />
                </PopoverContent>
              </Popover>
              
              <Input 
                type="time" 
                value={scheduledTime ? format(scheduledTime, 'HH:mm') : ''} 
                onChange={(e) => {
                  const [hours, minutes] = e.target.value.split(':');
                  const newDate = new Date(scheduledTime || new Date());
                  newDate.setHours(parseInt(hours, 10));
                  newDate.setMinutes(parseInt(minutes, 10));
                  setScheduledTime(newDate);
                }}
              />
            </div>

            {/* Post Summary */}
            <div className="space-y-2 pt-4 border-t">
              <h4 className="font-medium text-sm">Post Summary</h4>
              <div className="text-xs text-blue-600 space-y-1">
                <p>Characters: {caption.length}/2200</p>
                <p>Media: {media.length} files</p>
                <p>Hashtags: {hashtags.length}</p>
                <p>Platforms: {selectedProfiles.length}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-4 border-t">
              {post && (
                <Button variant="destructive" className="w-full" onClick={() => onDelete(post.id)}>
                  <Trash2 className="mr-2 h-4 w-4"/> Delete Post
                </Button>
              )}
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
                <Button className="flex-1" onClick={handleSave}>
                  {post ? 'Update' : 'Schedule'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}