'use client';

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Brain, TrendingUp, User, Building, Activity, Target } from "lucide-react";
import { LeadScore, QualificationStatus, BuyingSignal } from "@/lib/crm-types";

interface LeadScoringDisplayProps {
  leadId: string;
  score: LeadScore;
  qualification: QualificationStatus;
  buyingSignals: BuyingSignal[];
  className?: string;
}

export function LeadScoringDisplay({ 
  leadId, 
  score, 
  qualification, 
  buyingSignals, 
  className 
}: LeadScoringDisplayProps) {
  const getQualificationColor = (qualification: QualificationStatus) => {
    switch (qualification) {
      case QualificationStatus.SALES_QUALIFIED:
        return 'bg-green-500';
      case QualificationStatus.MARKETING_QUALIFIED:
        return 'bg-blue-500';
      case QualificationStatus.OPPORTUNITY:
        return 'bg-yellow-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getQualificationLabel = (qualification: QualificationStatus) => {
    switch (qualification) {
      case QualificationStatus.SALES_QUALIFIED:
        return 'SQL';
      case QualificationStatus.MARKETING_QUALIFIED:
        return 'MQL';
      case QualificationStatus.OPPORTUNITY:
        return 'OPP';
      default:
        return 'UNQ';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-gray-500';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <Target className="h-4 w-4 text-green-600" />;
    if (score >= 60) return <TrendingUp className="h-4 w-4 text-blue-600" />;
    if (score >= 40) return <Activity className="h-4 w-4 text-yellow-600" />;
    return <User className="h-4 w-4 text-gray-500" />;
  };

  const strongBuyingSignals = buyingSignals.filter(signal => signal.strength > 0.7);

  return (
    <TooltipProvider>
      <div className={`space-y-3 ${className}`}>
        {/* Overall Score and Qualification */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium">AI Score</span>
            <Tooltip>
              <TooltipTrigger>
                <div className={`text-lg font-bold ${getScoreColor(score.total)}`}>
                  {Math.round(score.total)}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="space-y-1">
                  <div>Fit: {Math.round(score.fit)}</div>
                  <div>Intent: {Math.round(score.intent)}</div>
                  <div>Engagement: {Math.round(score.engagement)}</div>
                  <div>Timing: {Math.round(score.timing)}</div>
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
          
          <Badge 
            className={`${getQualificationColor(qualification)} text-white`}
            variant="secondary"
          >
            {getQualificationLabel(qualification)}
          </Badge>
        </div>

        {/* Score Breakdown */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center space-x-1">
              <User className="h-3 w-3" />
              <span>Fit</span>
            </span>
            <span>{Math.round(score.fit)}</span>
          </div>
          <Progress value={score.fit} className="h-1" />
          
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center space-x-1">
              <Activity className="h-3 w-3" />
              <span>Intent</span>
            </span>
            <span>{Math.round(score.intent)}</span>
          </div>
          <Progress value={score.intent} className="h-1" />
          
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center space-x-1">
              <TrendingUp className="h-3 w-3" />
              <span>Engage</span>
            </span>
            <span>{Math.round(score.engagement)}</span>
          </div>
          <Progress value={score.engagement} className="h-1" />
          
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center space-x-1">
              <Building className="h-3 w-3" />
              <span>Timing</span>
            </span>
            <span>{Math.round(score.timing)}</span>
          </div>
          <Progress value={score.timing} className="h-1" />
        </div>

        {/* Buying Signals */}
        {strongBuyingSignals.length > 0 && (
          <div className="pt-2 border-t">
            <div className="text-xs font-medium text-green-600 mb-1">
              🔥 Hot Signals ({strongBuyingSignals.length})
            </div>
            <div className="flex flex-wrap gap-1">
              {strongBuyingSignals.slice(0, 3).map((signal, index) => (
                <Tooltip key={index}>
                  <TooltipTrigger>
                    <Badge variant="outline" className="text-xs border-green-500 text-green-700">
                      {signal.type.replace('_', ' ')}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="space-y-1">
                      <div className="font-medium">{signal.description}</div>
                      <div className="text-xs">Strength: {Math.round(signal.strength * 100)}%</div>
                      <div className="text-xs">Detected: {signal.detectedAt.toLocaleDateString()}</div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>
        )}

        {/* Last Updated */}
        <div className="text-xs text-gray-500 pt-1">
          Updated: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </TooltipProvider>
  );
}