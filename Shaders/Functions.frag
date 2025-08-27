#version 330 core
out vec4 FragColor;
uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;



vec4 DrawCircle(vec2 uv, vec3 color, vec2 pos, float radius, float edge) {
    vec2 posn = pos / iResolution.xy;
    float dist = distance(uv, posn);
    float alpha = smoothstep(radius, radius - edge, dist);
    return vec4(color, alpha);
}


vec4 DrawSquare(vec2 uv, vec3 color, vec2 pos, float size, float edge) {
    vec2 posn = pos / iResolution.xy;
    vec2 d = abs(uv - posn);
    float alpha = smoothstep(size, size - edge, max(d.x, d.y));
    return vec4(color, alpha);
}

vec4 DrawTriangle(vec2 uv, vec3 color, vec2 pos, float size, float edge) {
    vec2 posn = pos / iResolution.xy;
    vec2 p = uv - posn;

    float k = sqrt(3.0);
    p.x = abs(p.x) - size;
    p.y = p.y + size / k;
    if(p.x + k * p.y > 0.0) p = vec2(p.x - k * p.y, -k * p.x - p.y) / 2.0;
    p.x -= clamp(p.x, -2.0 * size, 0.0);

    float dist = length(p) * sign(p.y);
    float alpha = smoothstep(0.0, edge, dist);
    return vec4(color, alpha);
}


void main()
{
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    vec2 mouseNorm = iMouse.xy ;
    vec3 baseColor = 0.5 + 0.5 * cos(iTime + uv.xyx + vec3(0,2,4));
    
    vec4 circle = DrawCircle(uv, vec3(0.0, 0.0, 1.0), mouseNorm, 0.1, 0.01);
    vec4 triangle = DrawTriangle(uv, vec3(0.0, 0.0, 1.0), mouseNorm, 0.1, 0.01);
    vec4 square = DrawSquare(uv, vec3(0.0, 0.0, 1.0), mouseNorm, 0.1, 0.01);
    vec2 posn = mouseNorm / iResolution.xy;

    if(posn.x <= 0.3) 
    {
        FragColor = mix(vec4(baseColor, 1.0), circle, circle.a);
    } else if (posn.x >= 0.7)
    {
        FragColor = mix(vec4(baseColor, 1.0), triangle, triangle.a);
    } else if (posn.x > 0.3 && posn.x < 0.7)
    {
        FragColor = mix(vec4(baseColor, 1.0), square, square.a);
    }

}


