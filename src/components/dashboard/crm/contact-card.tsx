'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  GripVertical,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  Target,
  Activity,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  Edit,
  Trash2,
  MessageSquare,
  FileText,
  Zap,
  Brain,
  TrendingUp,
  AlertTriangle,
  Building,
  MapPin,
  Globe,
  User,
  Tag as TagIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  Lead, 
  LeadScore, 
  QualificationStatus, 
  BuyingSignal, 
  Priority,
  LeadSource,
  LeadStatus,
  Contact,
  Tag,
  LeadActivity
} from "@/lib/crm-types";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";

interface ContactCardProps {
  contact: Contact;
  lead?: Lead;
  score?: LeadScore;
  qualification?: QualificationStatus;
  buyingSignals?: BuyingSignal[];
  tags?: Tag[];
  activities?: LeadActivity[];
  onDragStart?: (contact: Contact) => void;
  onEdit?: (contact: Contact) => void;
  onDelete?: (contactId: string) => void;
  onViewDetails?: (contact: Contact) => void;
  className?: string;
  compact?: boolean;
}

export function ContactCard({
  contact,
  lead,
  score,
  qualification,
  buyingSignals = [],
  tags = [],
  activities = [],
  onDragStart,
  onEdit,
  onDelete,
  onViewDetails,
  className,
  compact = false
}: ContactCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    if (onDragStart) {
      onDragStart(contact);
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', contact.id);
    }
  };

  const getQualificationColor = (qual?: QualificationStatus) => {
    if (!qual) return 'bg-gray-400 text-white';
    switch (qual) {
      case QualificationStatus.SALES_QUALIFIED:
        return 'bg-green-500 text-white';
      case QualificationStatus.MARKETING_QUALIFIED:
        return 'bg-blue-500 text-white';
      case QualificationStatus.OPPORTUNITY:
        return 'bg-yellow-500 text-white';
      default:
        return 'bg-gray-400 text-white';
    }
  };

  const getScoreColor = (scoreValue?: number) => {
    if (!scoreValue) return 'text-gray-500';
    if (scoreValue >= 80) return 'text-green-600';
    if (scoreValue >= 60) return 'text-blue-600';
    if (scoreValue >= 40) return 'text-yellow-600';
    return 'text-gray-500';
  };

  const getPriorityColor = (priority?: Priority) => {
    switch (priority) {
      case Priority.HIGH:
        return 'text-red-600 bg-red-50 border-red-200';
      case Priority.MEDIUM:
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case Priority.LOW:
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusColor = (status?: LeadStatus) => {
    switch (status) {
      case LeadStatus.NEW:
        return 'bg-blue-100 text-blue-800';
      case LeadStatus.CONTACTED:
        return 'bg-yellow-100 text-yellow-800';
      case LeadStatus.QUALIFIED:
        return 'bg-green-100 text-green-800';
      case LeadStatus.CONVERTED:
        return 'bg-purple-100 text-purple-800';
      case LeadStatus.LOST:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const hotSignals = buyingSignals.filter(signal => signal.strength > 0.7);
  const recentActivity = activities.slice(0, 3);
  const initials = `${contact.firstName?.[0] || ''}${contact.lastName?.[0] || ''}`.toUpperCase();

  if (compact) {
    return (
      <Card 
        className={cn(
          "group cursor-grab active:cursor-grabbing transition-all hover:shadow-md border-l-4",
          className
        )}
        style={{ borderLeftColor: score && score.total >= 80 ? '#EF4444' : '#E5E7EB' }}
        draggable={!!onDragStart}
        onDragStart={handleDragStart}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarImage src={contact.avatar} />
                <AvatarFallback className="text-xs">{initials}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-sm truncate">
                    {contact.firstName} {contact.lastName}
                  </h4>
                  {hotSignals.length > 0 && (
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  )}
                </div>
                <p className="text-xs text-gray-600 truncate">{contact.company}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {score && (
                <div className="flex items-center gap-1">
                  <Brain className="h-3 w-3 text-purple-600" />
                  <span className={cn("text-xs font-bold", getScoreColor(score.total))}>
                    {Math.round(score.total)}
                  </span>
                </div>
              )}
              
              {onDragStart && (
                <GripVertical className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </div>
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {tags.slice(0, 2).map((tag) => (
                <Badge
                  key={tag.id}
                  variant="outline"
                  className="text-xs px-1 py-0"
                  style={{ borderColor: tag.color, color: tag.color }}
                >
                  {tag.name}
                </Badge>
              ))}
              {tags.length > 2 && (
                <Badge variant="outline" className="text-xs px-1 py-0">
                  +{tags.length - 2}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <TooltipProvider>
      <Card 
        className={cn(
          "group cursor-grab active:cursor-grabbing transition-all hover:shadow-lg relative overflow-hidden",
          className
        )}
        draggable={!!onDragStart}
        onDragStart={handleDragStart}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Hot signals indicator */}
        {hotSignals.length > 0 && (
          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-pulse z-10">
            🔥
          </div>
        )}

        {/* Priority indicator */}
        {lead?.priority && lead.priority !== Priority.NORMAL && (
          <div className="absolute top-2 left-2 z-10">
            <Badge className={cn("text-xs", getPriorityColor(lead.priority))}>
              {lead.priority}
            </Badge>
          </div>
        )}

        <CardContent className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3 flex-1">
              <Avatar className="h-12 w-12">
                <AvatarImage src={contact.avatar} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-base truncate">
                    {contact.firstName} {contact.lastName}
                  </h4>
                  {lead?.status && (
                    <Badge className={cn("text-xs", getStatusColor(lead.status))}>
                      {lead.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  )}
                </div>
                
                <div className="space-y-1">
                  {contact.company && (
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Building className="h-3 w-3" />
                      <span className="truncate">{contact.company}</span>
                    </div>
                  )}
                  
                  {contact.title && (
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <User className="h-3 w-3" />
                      <span className="truncate">{contact.title}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {onDragStart && (
                <GripVertical className="h-5 w-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {onViewDetails && (
                    <DropdownMenuItem onClick={() => onViewDetails(contact)}>
                      <FileText className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                  )}
                  {onEdit && (
                    <DropdownMenuItem onClick={() => onEdit(contact)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Contact
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem>
                    <Mail className="mr-2 h-4 w-4" />
                    Send Email
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Phone className="mr-2 h-4 w-4" />
                    Call
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule Meeting
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {onDelete && (
                    <DropdownMenuItem 
                      onClick={() => onDelete(contact.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-2 mb-3">
            {contact.email && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-3 w-3 text-gray-400" />
                <a 
                  href={`mailto:${contact.email}`}
                  className="text-blue-600 hover:underline truncate"
                >
                  {contact.email}
                </a>
              </div>
            )}
            
            {contact.phone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-3 w-3 text-gray-400" />
                <a 
                  href={`tel:${contact.phone}`}
                  className="text-blue-600 hover:underline"
                >
                  {contact.phone}
                </a>
              </div>
            )}
            
            {contact.location && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-3 w-3 text-gray-400" />
                <span className="truncate">{contact.location}</span>
              </div>
            )}
          </div>

          {/* AI Score and Qualification */}
          {(score || qualification) && (
            <div className="flex items-center justify-between mb-3 p-2 bg-gray-50 rounded-lg">
              {score && (
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium">AI Score:</span>
                  <span className={cn("text-sm font-bold", getScoreColor(score.total))}>
                    {Math.round(score.total)}/100
                  </span>
                </div>
              )}
              
              {qualification && (
                <Badge className={cn("text-xs", getQualificationColor(qualification))}>
                  {qualification.replace('_', ' ').toUpperCase()}
                </Badge>
              )}
            </div>
          )}

          {/* Deal Value */}
          {lead?.estimatedValue && (
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">
                ${lead.estimatedValue.toLocaleString()}
              </span>
            </div>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div className="mb-3">
              <div className="flex flex-wrap gap-1">
                {tags.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant="outline"
                    className="text-xs"
                    style={{ borderColor: tag.color, color: tag.color }}
                  >
                    <TagIcon className="mr-1 h-2 w-2" />
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Buying Signals */}
          {hotSignals.length > 0 && (
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-red-600" />
                <span className="text-sm font-medium text-red-600">Hot Signals</span>
              </div>
              <div className="space-y-1">
                {hotSignals.slice(0, 2).map((signal, index) => (
                  <Tooltip key={index}>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 p-1 rounded">
                        <AlertTriangle className="h-3 w-3" />
                        <span className="truncate">{signal.type}</span>
                        <span className="font-medium">
                          {Math.round(signal.strength * 100)}%
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{signal.description}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </div>
          )}

          {/* Recent Activity */}
          {recentActivity.length > 0 && (
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium">Recent Activity</span>
              </div>
              <div className="space-y-1">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs text-gray-600">
                    <Clock className="h-3 w-3" />
                    <span className="truncate">{activity.type}</span>
                    <span className="text-gray-400">
                      {new Date(activity.timestamp?.seconds * 1000 || 0).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
            <div className="flex items-center gap-2">
              {lead?.source && (
                <span>Source: {lead.source.replace('_', ' ')}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {contact.lastContactedAt && (
                <span>
                  Last contact: {new Date(contact.lastContactedAt.seconds * 1000).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}