import React from 'react';
import {
  GraduationCap,
  Plane,
  Dumbbell,
  Salad,
  Briefcase,
  Kanban,
  Wallet,
  CalendarDays,
  Clock,
  Sparkles,
  LucideProps,
} from 'lucide-react';
import { PlanCategory } from '../types/plan';

interface CategoryIconProps extends LucideProps {
  category: PlanCategory;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ category, ...props }) => {
  switch (category) {
    case 'study':
      return <GraduationCap {...props} />;
    case 'trip':
      return <Plane {...props} />;
    case 'fitness':
      return <Dumbbell {...props} />;
    case 'diet':
      return <Salad {...props} />;
    case 'business':
      return <Briefcase {...props} />;
    case 'project':
      return <Kanban {...props} />;
    case 'budget':
      return <Wallet {...props} />;
    case 'event':
      return <CalendarDays {...props} />;
    case 'schedule':
      return <Clock {...props} />;
    case 'custom':
    default:
      return <Sparkles {...props} />;
  }
};
