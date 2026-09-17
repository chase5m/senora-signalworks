ChaseBootlegDashboardMath = {}

local chaseTolerance = 1.0e-10

local function ChaseFinite(value)
    return type(value) == 'number' and value == value and value > -math.huge and value < math.huge
end

local function ChasePoint(value)
    return type(value) == 'table' and ChaseFinite(value.x) and ChaseFinite(value.y)
end

local function ChaseCross(first, second, third)
    return (second.x - first.x) * (third.y - second.y) - (second.y - first.y) * (third.x - second.x)
end

local function ChaseNormalizedCorners(corners, cursor)
    if type(corners) ~= 'table' or not ChasePoint(cursor) then return nil end
    local minimumX, minimumY, maximumX, maximumY = math.huge, math.huge, -math.huge, -math.huge
    for index = 1, 4 do
        local point = corners[index]
        if not ChasePoint(point) then return nil end
        minimumX, minimumY = math.min(minimumX, point.x), math.min(minimumY, point.y)
        maximumX, maximumY = math.max(maximumX, point.x), math.max(maximumY, point.y)
    end
    local span = math.max(maximumX - minimumX, maximumY - minimumY)
    if not ChaseFinite(span) or span <= 0.0 then return nil end
    local points = {}
    for index = 1, 4 do
        points[index] = { x = (corners[index].x - minimumX) / span, y = (corners[index].y - minimumY) / span }
    end
    local winding = { points[1], points[2], points[4], points[3] }
    local direction = nil
    for index = 1, 4 do
        local cross = ChaseCross(winding[index], winding[index % 4 + 1], winding[(index + 1) % 4 + 1])
        if math.abs(cross) <= chaseTolerance then return nil end
        if direction and direction * cross < 0.0 then return nil end
        direction = cross
    end
    return points, (cursor.x - minimumX) / span, (cursor.y - minimumY) / span
end

function ChaseBootlegDashboardMath.ChaseUv(corners, cursor)
    local points, x, y = ChaseNormalizedCorners(corners, cursor)
    if not points or not ChaseFinite(x) or not ChaseFinite(y) then return nil end
    local topLeft, topRight, bottomLeft, bottomRight = points[1], points[2], points[3], points[4]
    local firstX, firstY = topRight.x - bottomRight.x, topRight.y - bottomRight.y
    local secondX, secondY = bottomLeft.x - bottomRight.x, bottomLeft.y - bottomRight.y
    local perspectiveX = topLeft.x - topRight.x - bottomLeft.x + bottomRight.x
    local perspectiveY = topLeft.y - topRight.y - bottomLeft.y + bottomRight.y
    local g, h = 0.0, 0.0
    if math.abs(perspectiveX) > chaseTolerance or math.abs(perspectiveY) > chaseTolerance then
        local denominator = firstX * secondY - secondX * firstY
        if math.abs(denominator) <= chaseTolerance then return nil end
        g = (perspectiveX * secondY - secondX * perspectiveY) / denominator
        h = (firstX * perspectiveY - perspectiveX * firstY) / denominator
    end
    if 1.0 + g <= chaseTolerance or 1.0 + h <= chaseTolerance or 1.0 + g + h <= chaseTolerance then return nil end
    local a = topRight.x - topLeft.x + g * topRight.x - g * x
    local b = bottomLeft.x - topLeft.x + h * bottomLeft.x - h * x
    local d = topRight.y - topLeft.y + g * topRight.y - g * y
    local e = bottomLeft.y - topLeft.y + h * bottomLeft.y - h * y
    local determinant = a * e - b * d
    if math.abs(determinant) <= chaseTolerance then return nil end
    local horizontal, vertical = x - topLeft.x, y - topLeft.y
    local u = (horizontal * e - b * vertical) / determinant
    local v = (a * vertical - horizontal * d) / determinant
    if not ChaseFinite(u) or not ChaseFinite(v) then return nil end
    if u < -chaseTolerance or u > 1.0 + chaseTolerance or v < -chaseTolerance or v > 1.0 + chaseTolerance then return nil end
    return math.max(0.0, math.min(1.0, u)), math.max(0.0, math.min(1.0, v))
end

function ChaseBootlegDashboardMath.ChaseAxisDelta(origin, endpoint, mouseDx, mouseDy, axisWorldLength)
    if not ChasePoint(origin) or not ChasePoint(endpoint) then return nil end
    if not ChaseFinite(mouseDx) or not ChaseFinite(mouseDy) or not ChaseFinite(axisWorldLength) or axisWorldLength <= 0.0 then return nil end
    local x, y = endpoint.x - origin.x, endpoint.y - origin.y
    local span = math.max(math.abs(x), math.abs(y))
    if not ChaseFinite(span) or span <= 1.0e-12 then return nil end
    x, y = x / span, y / span
    local delta = ((mouseDx / span) * x + (mouseDy / span) * y) / (x * x + y * y) * axisWorldLength
    return ChaseFinite(delta) and delta or nil
end
