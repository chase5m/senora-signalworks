-- Created by Chase. Disable speech indicators without changing microphone or receiver audio behavior.
ChaseBootlegConfig.Speech = {
    enabled = true,
    -- Show a small passive indicator while the receiver and phone app are closed.
    hud = true,
    -- Local microphone checks in milliseconds. State messages are sent only when the display changes.
    pollMilliseconds = 100
}

-- Anyone can browse active listed stations; tuning still requires the appropriate receiver item.
ChaseBootlegConfig.Commands.directory = ChaseBootlegConfig.Commands.directory or 'senorafrequencies'
