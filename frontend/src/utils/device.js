export function getDeviceLabel(userAgent = "") {
  const ua = userAgent.toLowerCase();

  let browser = "Browser";

  if (ua.includes("edg")) browser = "Edge";
  else if (ua.includes("chrome")) browser = "Chrome";
  else if (ua.includes("firefox")) browser = "Firefox";
  else if (ua.includes("safari") && !ua.includes("chrome")) browser = "Safari";

  let os = "Device";

  if (ua.includes("windows")) os = "Windows";
  else if (ua.includes("android")) os = "Android";
  else if (ua.includes("iphone")) os = "iPhone";
  else if (ua.includes("ipad")) os = "iPad";
  else if (ua.includes("mac os")) os = "macOS";
  else if (ua.includes("linux")) os = "Linux";

  return `${browser} on ${os}`;
}
