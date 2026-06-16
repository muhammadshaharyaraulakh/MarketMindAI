import re

with open('src/dashboard/Dashboard.jsx', 'r') as f:
    text = f.read()

# Add new icons to import list
import_block = """  ArrowUpTrayIcon,
  LightBulbIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline'"""

new_import_block = """  ArrowUpTrayIcon,
  LightBulbIcon,
  UserCircleIcon,
  Squares2X2Icon,
  MegaphoneIcon,
  DocumentChartBarIcon
} from '@heroicons/react/24/outline'"""

text = text.replace(import_block, new_import_block)

# Replace navigation array
nav_block = """            {[
              { id: 'dashboard', path: '/dashboard', label: 'Overview Canvas', icon: PresentationChartLineIcon },
              { id: 'campaigns', path: '/campaigns', label: 'Campaign Hub', icon: ChartBarIcon },
              { id: 'data', path: '/data', label: 'Data Ingestion', icon: ArrowUpTrayIcon },
              { id: 'insights', path: '/insights', label: 'AI Insights', icon: LightBulbIcon },
              { id: 'advisor', path: '/advisor', label: 'AI Advisor Chat', icon: ChatBubbleLeftRightIcon },
              { id: 'reports', path: '/reports', label: 'Reports Export', icon: PresentationChartLineIcon },
              { id: 'integrations', path: '/integrations', label: 'Platform Integrations', icon: PuzzlePieceIcon }
            ].map(tab => ("""

new_nav_block = """            {[
              { id: 'dashboard', path: '/dashboard', label: 'Overview Canvas', icon: Squares2X2Icon },
              { id: 'campaigns', path: '/campaigns', label: 'Campaign Hub', icon: MegaphoneIcon },
              { id: 'data', path: '/data', label: 'Data Ingestion', icon: ArrowUpTrayIcon },
              { id: 'insights', path: '/insights', label: 'AI Insights', icon: LightBulbIcon },
              { id: 'advisor', path: '/advisor', label: 'AI Advisor Chat', icon: ChatBubbleLeftRightIcon },
              { id: 'reports', path: '/reports', label: 'Reports Export', icon: DocumentChartBarIcon },
              { id: 'integrations', path: '/integrations', label: 'Platform Integrations', icon: PuzzlePieceIcon }
            ].map(tab => ("""

text = text.replace(nav_block, new_nav_block)

with open('src/dashboard/Dashboard.jsx', 'w') as f:
    f.write(text)
