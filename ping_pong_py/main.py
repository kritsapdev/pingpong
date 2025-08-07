import pygame
import sys

# Initialize Pygame
pygame.init()

# Screen dimensions
WIDTH, HEIGHT = 800, 600
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Ping Pong")

# Colors
BLACK = (0, 0, 0)
WHITE = (255, 255, 255)

# Game constants
PADDLE_WIDTH, PADDLE_HEIGHT = 10, 100
BALL_RADIUS = 10

# Game objects
player_paddle = pygame.Rect(10, HEIGHT // 2 - PADDLE_HEIGHT // 2, PADDLE_WIDTH, PADDLE_HEIGHT)
com_paddle = pygame.Rect(WIDTH - 10 - PADDLE_WIDTH, HEIGHT // 2 - PADDLE_HEIGHT // 2, PADDLE_WIDTH, PADDLE_HEIGHT)
ball = pygame.Rect(WIDTH // 2 - BALL_RADIUS, HEIGHT // 2 - BALL_RADIUS, BALL_RADIUS * 2, BALL_RADIUS * 2)

# Ball speed
ball_speed_x = 7
ball_speed_y = 7

# Paddle speed
player_speed = 0
com_speed = 7

# Clock
clock = pygame.time.Clock()

# Score
player_score = 0
com_score = 0
game_font = pygame.font.Font("freesansbold.ttf", 32)

def ball_restart():
    global ball_speed_x, ball_speed_y
    ball.center = (WIDTH/2, HEIGHT/2)
    ball_speed_y *= -1 # Let's not make it predictable
    ball_speed_x *= -1

def ball_animation():
    global ball_speed_x, ball_speed_y, player_score, com_score
    ball.x += ball_speed_x
    ball.y += ball_speed_y

    if ball.top <= 0 or ball.bottom >= HEIGHT:
        ball_speed_y *= -1

    # Scoring
    if ball.left <= 0:
        com_score += 1
        ball_restart()

    if ball.right >= WIDTH:
        player_score += 1
        ball_restart()

    if ball.colliderect(player_paddle) or ball.colliderect(com_paddle):
        ball_speed_x *= -1

def player_animation():
    player_paddle.y += player_speed
    if player_paddle.top <= 0:
        player_paddle.top = 0
    if player_paddle.bottom >= HEIGHT:
        player_paddle.bottom = HEIGHT

def com_ai():
    if com_paddle.top < ball.y:
        com_paddle.y += com_speed
    if com_paddle.bottom > ball.y:
        com_paddle.y -= com_speed
    if com_paddle.top <= 0:
        com_paddle.top = 0
    if com_paddle.bottom >= HEIGHT:
        com_paddle.bottom = HEIGHT


# Game loop
def game_loop():
    global player_speed

    while True:
        # Event handling
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()
            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_w:
                    player_speed -= 7
                if event.key == pygame.K_s:
                    player_speed += 7
            if event.type == pygame.KEYUP:
                if event.key == pygame.K_w:
                    player_speed += 7
                if event.key == pygame.K_s:
                    player_speed -= 7


        # Game Logic
        ball_animation()
        player_animation()
        com_ai()

        # Drawing
        screen.fill(BLACK)
        pygame.draw.rect(screen, WHITE, player_paddle)
        pygame.draw.rect(screen, WHITE, com_paddle)
        pygame.draw.ellipse(screen, WHITE, ball)
        pygame.draw.aaline(screen, WHITE, (WIDTH // 2, 0), (WIDTH // 2, HEIGHT))

        player_text = game_font.render(f"{player_score}", False, WHITE)
        screen.blit(player_text, (WIDTH / 2 + 20, HEIGHT / 2))

        com_text = game_font.render(f"{com_score}", False, WHITE)
        screen.blit(com_text, (WIDTH / 2 - 40, HEIGHT / 2))


        # Update the display
        pygame.display.flip()
        clock.tick(60)

if __name__ == '__main__':
    game_loop()
