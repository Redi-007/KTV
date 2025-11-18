import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useApp } from '@/lib/AppContext'
import { CaretDown, SignOut, User, GearSix } from '@phosphor-icons/react'

interface TopBarProps {
  title: string
}

export function TopBar({ title }: TopBarProps) {
  const { currentUser } = useApp()

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
  }

  return (
    <header className="fixed top-0 left-64 right-0 h-16 border-b border-border bg-background z-10">
      <div className="h-full px-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>

        <div className="flex items-center gap-4">
          {currentUser && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {getInitials(currentUser.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{currentUser.name}</span>
                  <CaretDown size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium">{currentUser.name}</p>
                    <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                    <p className="text-xs text-muted-foreground">{currentUser.institutionName}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2" size={16} />
                  <span>Profili</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <GearSix className="mr-2" size={16} />
                  <span>Cilësimet</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <SignOut className="mr-2" size={16} />
                  <span>Dil</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  )
}
