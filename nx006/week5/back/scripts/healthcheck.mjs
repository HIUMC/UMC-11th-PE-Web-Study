const response = await fetch(`http://127.0.0.1:${process.env.PORT ?? 3000}/members/nickname/healthcheck`);
if (!response.ok) process.exitCode = 1;
