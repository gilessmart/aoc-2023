import Node from "./Node";

export function parse(text: string): { directions: string[], nodes: Node[] } {
    const lines = text.split('\n').map(l => l.trim());
    const directions = parseDirections(lines[0]);
    const nodes = parseNodes(lines.slice(2));
    return { directions, nodes };
}

function parseDirections(text: string): string[] {
    return text.trim().split('');
}

function parseNodes(lines: string[]) {
    const nodeNameMap = buildNodeNameMap(lines);
    const nodeMap = createNodeMap(nodeNameMap);
    return Array.from(nodeMap.values());
};

function buildNodeNameMap(lines: string[]): Map<string, { left: string, right: string }> {
    const result = new Map<string, { left: string, right: string }>();

    for (const line of lines) {
        const match = line.match(/([A-Z0-9]+) = \(([A-Z0-9]+), ([A-Z0-9]+)\)/);
        if (match === null) throw new Error(`Failed to parse line '${line}'`);        
        result.set(match[1], { left: match[2], right: match[3] });
    }

    return result;
}

function createNodeMap(nodeNameMap: Map<string, { left: string, right: string }>) {
    const result = new Map<string, Node>();

    for (const [ name, childNames ] of nodeNameMap) {
        let node = result.get(name);
        if (node === undefined) {
            node = { name, leftChild: null!, rightChild: null! };
            result.set(name, node);
        }
        
        let leftChild = result.get(childNames.left);
        if (leftChild === undefined) {
            leftChild = { name: childNames.left, leftChild: null!, rightChild: null! };
            result.set(childNames.left, leftChild);
        }
        node.leftChild = leftChild;

        let rightChild = result.get(childNames.right);
        if (rightChild === undefined) {
            rightChild = { name: childNames.right, leftChild: null!, rightChild: null! };
            result.set(childNames.right, rightChild);
        }
        node.rightChild = rightChild;
    }

    return result;
}